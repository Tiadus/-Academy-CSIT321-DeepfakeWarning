import argparse
import os
import torch
from torch import nn, Tensor
from torch.utils.data import DataLoader
from torchvision import transforms
import yaml
from model import RawGAT_ST  # Update import based on your model structure
from data_utils import ASVDataset
from core_scripts.startup_config import set_random_seed
import numpy as np


def pad(x, max_len=64600):
    x_len = x.shape[0]
    if x_len >= max_len:
        return x[:max_len]
    num_repeats = int(max_len / x_len) + 1
    padded_x = np.tile(x, (1, num_repeats))[:, :max_len][0]
    return padded_x


def produce_evaluation_file(dataset, model, device):
    data_loader = DataLoader(dataset, batch_size=1, shuffle=False)
    model.eval()

    fname_list = []
    score_list = []

    for batch_x, _, batch_meta in data_loader:
        batch_x = batch_x.to(device)
        batch_out = model(batch_x, Freq_aug=False)
        batch_score = batch_out[:, 1].data.cpu().numpy().ravel()

        fname_list.extend(list(batch_meta['file_name']))
        score_list.extend(batch_score.tolist())

    results = []
    for f, cm in zip(fname_list, score_list):
        result = {'filename': f, 'score': cm}
        results.append(result)
    return results


if __name__ == '__main__':
    parser = argparse.ArgumentParser('ASVSpoof2019 RawGAT-ST model')

    parser.add_argument('--database_path', type=str, default='',
                        help='Change this to user\'s full directory address of LA database (ASVspoof2019- for training, development and evaluation scores). We assume that all three ASVspoof 2019 LA train, LA dev and  LA eval data folders are in the same database_path directory.')
    '''
    % database_path (full LA directory address)/
    %      |- ASVspoof2019_LA_eval/flac
    %      |- ASVspoof2019_LA_train/flac
    %      |- ASVspoof2019_LA_dev/flac
    '''

    parser.add_argument('--protocols_path', type=str, default='',
                        help='Change with path to user\'s LA database protocols directory address')
    '''
    % protocols_path/
    %      |- ASVspoof2019.LA.cm.eval.trl.txt
    %      |- ASVspoof2019.LA.cm.dev.trl.txt 
    %      |- ASVspoof2019.LA.cm.train.trn.txt 
    '''

    # Hyperparameters
    parser.add_argument('--batch_size', type=int, default=10)
    parser.add_argument('--num_epochs', type=int, default=2)
    parser.add_argument('--lr', type=float, default=0.0001)
    parser.add_argument('--weight_decay', type=float, default=0.0001)
    parser.add_argument('--loss', type=str, default='WCE', help='Weighted Cross Entropy Loss ')

    # model
    parser.add_argument('--seed', type=int, default=1234,
                        help='random seed (default: 1234)')

    parser.add_argument('--model_path', type=str,
                        default='./Pre_trained_models/RawGAT_ST_mul/Best_epoch.pth', help='Model checkpoint')  # for pre-trained model
    parser.add_argument('--comment', type=str, default=None,
                        help='Comment to describe the saved model')
    # Auxiliary arguments
    parser.add_argument('--track', type=str, default='logical', choices=['logical', 'physical'],
                        help='logical/physical')
    parser.add_argument('--eval_output', type=str, default="self_eval.txt",
                        help='Path to save the evaluation result')
    parser.add_argument('--eval', action='store_true', default=True,
                        help='eval mode')  # for pre-trained model
    parser.add_argument('--is_eval', action='store_true', default=True, help='eval database')
    parser.add_argument('--eval_part', type=int, default=0)
    parser.add_argument('--features', type=str, default='Raw_GAT')

    # backend options
    parser.add_argument('--cudnn-deterministic-toggle', action='store_false',
                        default=True,
                        help='use cudnn-deterministic? (default true)')

    parser.add_argument('--cudnn-benchmark-toggle', action='store_true',
                        default=False,
                        help='use cudnn-benchmark? (default false)')
    parser.add_argument('--single_file', type=str, required=True,
                        help='Path to a single file for evaluation')

    args = parser.parse_args()

    # Make experiment reproducible
    set_random_seed(args.seed, args)

    # Define transformations
    transformations = transforms.Compose([
        lambda x: pad(x),
        lambda x: Tensor(x)
    ])

    # GPU device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    #print('Device:', device)

    # Load the dataset for a single file
    eval_set = ASVDataset(file_path=args.single_file, transform=transformations)

    # Load model configuration
    with open('model_config_RawGAT_ST.yaml', 'r') as f:
        config = yaml.safe_load(f)

    # Initialize model
    model_params = {
        'nb_samp': config['model']['nb_samp'],
        'out_channels': config['model']['out_channels'],
        'first_conv': config['model']['first_conv'],
        'in_channels': config['model']['in_channels'],
        'filts': config['model']['filts'],
        'blocks': config['model']['blocks'],
        'nb_classes': config['model']['nb_classes']
    }

    model = RawGAT_ST(model_params, device).to(device)

    # Load pre-trained model
    model.load_state_dict(torch.load(args.model_path, map_location=device))
    #print('Model loaded:', args.model_path)
    
    # Evaluation
    results = produce_evaluation_file(eval_set, model, device)
    analysis_result = results[0]
    analysed_file_name = analysis_result['filename']
    analysed_file_score = analysis_result['score']
    print(analysed_file_score)