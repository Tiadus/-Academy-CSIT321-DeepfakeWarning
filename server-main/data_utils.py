import torch
import os
import soundfile as sf
from torch.utils.data import Dataset

class ASVDataset(Dataset):
    """ Utility class to load a single audio file for evaluation """
    def __init__(self, file_path=None, transform=None):
        assert file_path is not None, 'must provide a file path'
        self.file_path = file_path
        self.transform = transform

        # Read the file
        self.data_x, self.sample_rate = sf.read(self.file_path)

        # If transformation is required
        if self.transform:
            self.data_x = self.transform(self.data_x)

        # Only one sample
        self.length = 1

    def __len__(self):
        return self.length

    def __getitem__(self, idx):
        return self.data_x, 0, {'file_name': os.path.basename(self.file_path)}