<h1>Prerequisite</h1>
Python: Any version of Python 3 <br/>
Nodejs: Any version <br/>
Database: MySQL Database <br/>
Agora Account

<h1>Project Setup</h1>

<h2>Project Cloning</h2>
Use the following command to clone the project:
<ul>
  <li>git clone https://github.com/Tiadus/-Academy-CSIT321-DeepfakeWarning.git</li>
</ul>

<h2>Python Environment</h2>
The python environment name would be the current python version (could be more than 1 
if you have multiple versions of python, we recommend installing only 1 version of python 
and stick with it).

Access this link: "https://pytorch.org/get-started/locally/", select appropriate settings 
according to your machine. Notice there is a command below, copy the command, paste it in 
your Command Prompt. This would install Pytorch library and CUDA to run the model. 

In the Command Prompt, use these commands to install libraries:
<ul>
  <li>pip install numpy</li>
  <li>pip install librosa</li>
  <li>pip install joblib</li>
  <li>pip install pyyaml</li>
  <li>pip install tensorboard</li>
  <li>pip install soundfile</li>
</ul>

<h2>Application Library & Environment</h2>

In Visual Studio Code or any IDE of your choice, open the project folder, start 3 Command 
Prompt windows. Change directories into 3 folders within the project: server-main, web
interface, mobile-interface. In each of the terminal, use the command:
<ul>
  <li>npm install</li>
</ul>

<h2>Application Configuration Setup</h2>
In the project folder, create a file name "app-config.js" with the file content as below: 
![image](https://github.com/user-attachments/assets/3f496f5c-dd17-4b22-be78-d9e139ab75ed)

After creating the "app-config.js" in the main folder, copy that file. 
Navigate to the folder "server-main", paste the config file in it. 
Navigate to the "web-interface/src" folder, paste the config file. 

<h2>Frontend Data Setup</h2>
Navigate to the "public" folder located within "web-interface" folder, create a new folder 
name "audiofiles". 
Put two files sample.flac which should be an audio file contain a real voice and 
fake_sample.mp3 which should contain deepfake into the folder. Note that names and types 
of both files must be exactly the same as stated. 

<h2>Backend Audio Path Setup</h2>
Navigate to the folder "server-main", create a folder name "audio_files". This is the folder to 
store the audio files which are sent from the frontend to analyse for deepfake content. 
Backend Mock Database Setup

<h2>Database Setup</h2>
Change directory in terminal to folder "DB_Deployment" located within the folder "server
main", use the command: "node deployDB.js" to deploy the database. <br/>
Alternatively, in the same folder, use the command "node dropDB.js" to drop the database. 

<h2>Application Startup</h2>
Navigates into the three folders simultaneously "server-main", "web-interface", "mobile
interface” which represent the server, web interface and mobile interface then start them all 
up with command “npm start”.

<h2>Known Bug & Mitigation</h2>

A module that was compiled using NumPy 
1.x cannot be run with NumPy 2.0.0

Mitigation: This error happens because of incompatible 
Numpy version. To fix this, simply uninstall 
the current Numpy and install Numpy 1.x 
with command [pip install “numpy<2.0”] 
and restart your machine. 

Machine learning model using CPU instead of GPU

Mitigation: This error happens because the CUDA 
version does not come with pytorch. Make 
sure your CUDA comes with pytorch.
