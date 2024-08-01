Prerequisites:
Python: any version of Python 3
Nodejs: any version


Setup:
Project localization:
- Go to this GitHub repository: https://github.com/Tiadus/-Academy-CSIT321-DeepfakeWarning
- Open Command Prompt, change directory to wherever you want to keep the project.
- Use the command: git clone https://github.com/Tiadus/-Academy-CSIT321-DeepfakeWarning.git


Python environment for the model:
- The python environment name would be the current python version (could be more than 1 if you have multiple versions of python, we recommend installing only 1 version of python and stick with it).

- Access this link: "https://pytorch.org/get-started/locally/", select appropriate settings according to your machine. Notice there is a command below, copy the command, paste it in your Command Prompt. This would install Pytorch library and CUDA to run the model.

- In the Command Prompt, use these commands to install libraries:
+ pip install numpy
+ pip install librosa
+ pip install joblib
+ pip install pyyaml
+ pip install tensorboard
+ pip install soundfile


Library requirements for application layer:
In Visual Studio Code, open the project folder, start 3 Command Prompt windows. 
Change directories into 3 folders within the project: server-main, web-interface, mobile-interface. 
In each of the cmd, use the command:
	- npm install
	
Within the project folder, we are going to add some files and folders:
- In the project folder, create a file name "app-config.js" with the file content as below:


const server_main_port = 4000;

const server_main_ws = 'ws://localhost:' + server_main_port;
const server_main_http = 'http://localhost/:' + server_main_port;

const Agora_AppID = 'APP_ID';
const Agora_Token = null;
const Agora_Channel = 'main'

const config = {
    server_main_port: server_main_port,
    server_main_ws: server_main_ws,
    server_main_http: server_main_http,
    appId: Agora_AppID,
    token: Agora_Token,
    channel: Agora_Channel
}

module.exports = config;


- After creating the "app-config.js" in the main folder, copy that file.
- Navigate to the folder "server-main", paste the config file in it.
- Navigate to the "web-interface/src" folder, paste the config file.
- Navigate to the "public" folder located within "web-interface" folder, create a new folder name "audiofiles".
- Put two files sample.flac which should be an audio file contain a real voice and fake_sample.mp3 which should contain deepfake into the folder. 
- Navigate to the folder "server-main", create a folder name "audio_files".
		
Deploy mocked database:
	Change directory in cmd to folder "DB_Deployment" located within "server-main", use the command: "node deployDB.js" to deploy the database.
	Alternatively, in the same folder, use the command "node dropDB.js" to drop the database.

Start the machine:
	Open simultaneously 3 cmd folders: "server-main", "web-interface", "mobile-interface".
	Use the command: "npm start" to run the machine.
