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
Agora Calling Setup: <br/>
<ul><li>In the folder “src” within the folder web-interface, you will find a file named “app
config.example”. First, create a file “app-config.js”. Then, copy the content of the 
“app-config.example” over. Remember to use your Agora App Id. </li></ul>
Model Boundary Setup: <br/>
<ul><li>In the folder “server-main”, you can find the file “server-main-config.js”. Here, you 
can customize the boundary score, resulted from the analysis of the model in which 
the server will flag if a file is deepfake or not.</li></ul>
Database Setup: <br/>
<ul><li>In the folder “server-main”, you can find the file “db-config.js”. Here, you can 
customize the connection of your database. Make sure that the user and password of 
the connection is the same one that you setup for your MySQL database.</li></ul>

<h2>Frontend Data Setup</h2>
Navigate to the "public" folder located within "web-interface" folder, create a new folder 
name "audiofiles". 
Put two files sample.flac which should be an audio file contain a real voice and 
fake_sample.mp3 which should contain deepfake into the folder. Note that names and types 
of both files must be exactly the same as stated.

<h2>Database Setup</h2>
Change directory in terminal to folder "DB_Deployment" located within the folder "server
main", use the command: "node deployDB.js" to deploy the database. <br/>
Alternatively, in the same folder, use the command "node dropDB.js" to drop the database. 

<h2>Application Startup</h2>
Navigates into the three folders simultaneously "server-main" and "web-interface", which represent the server and web interface then start them all up with command “npm start”. <br/>
Once the web interface is started up, the React app will let you know which address and port that it can be found on the network. For example: “192.168.56.1:3000” means addresss 192.168.56.1 at port 3000. <br/>
Copy both the address and port then go into the folder “mobile-interface”, then folder “app” and open the file incall.jsx. At the bottom of the file is the rendering of the component WebView which open the call functionality in the web interface for the mobile interface. Change the uri using the copied address and port. For example, with the above address and port, the uri should be 'http://192.168.56.1:3000/client'.<br/>
Note that the route “/client” need to be kept.

<h2>Known Bug & Mitigation</h2>
A module that was compiled using NumPy 1.x cannot be run with NumPy 2.0.0:
<ul><li>Mitigation: This error happens because of incompatible 
Numpy version. To fix this, simply uninstall 
the current Numpy and install Numpy 1.x 
with command [pip install “numpy<2.0”] 
and restart your machine.</li></ul>

Machine learning model using CPU instead of GPU <br/>
<ul><li>Mitigation: This error happens because the CUDA 
version does not come with pytorch. Make 
sure your CUDA comes with pytorch.</li></ul>

Android simulator can not connect to the server even though the server is on:
<ul><li>Mitigation: This error happens because android 
simulator treats the localhost as its own 
device. To fix this, please open a terminal 
while making sure that the simulator is 
opened. Then type the following command: <br/>
<ul><li>adb reverse tcp:4000 tcp:4000</li></ul>
You can replace “4000” with whatever port 
your server is running on </li></ul>
