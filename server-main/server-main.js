const { exec } = require('child_process');

const APP_CONFIG = require('../app-config');
const server_main_port = APP_CONFIG.server_main_port;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const { Readable } = require('stream');

const User_Controller = require('./Class_Controller/User_Controller.js');
const Education_Controller = require('./Class_Controller/Education_Controller.js');
const Call_History = require('./Class_Entity/Call_History.js');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Naming the file with a unique name
  },
});

const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Retrieve the path of the uploaded file
    const filePath = path.join(uploadDir, req.file.filename);

    const result = await analyseFile(filePath);

    // Send a success response with the file path
    res.json({
      message: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'File upload failed',
      error: err.message,
    });
  }
});

async function analyseFile(filePath) {
  const pythonScriptPath = 'main.py';

  const command = `python ${pythonScriptPath} --single_file ${filePath}`;

  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error analyzing file: ${error.message}`);
        } else if (stderr) {
          reject(`Python script error: ${stderr}`);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });

    const evaluatedScore = parseFloat(stdout);
    console.log(`File Uploaded Score: ${evaluatedScore}`);

    if (evaluatedScore > -1.5) {
      return ('Deepfake');
    } else {
      return ('Safe');
    }
  } catch (error) {
    console.log(error);
  }
};

app.post('/api/register', async (req,res) => {
  const body = req.body;
  const email = body.email;
  const user_name = body.user_name;
  const phone = body.phone;
  const user_password = body.user_password;

  if (email === undefined || user_name === undefined || phone === undefined || user_password === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      const newUserID = await userController.registerUser(email, user_name, 'default.jpg', phone, user_password);
      res.json({newUserID: newUserID});
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

const decodeCredential = (encodedCredential) => {
  try {
    const decodedCredential = atob(encodedCredential);
    return decodedCredential;
  } catch(error) {
    console.log(error);
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 409;
    throw badRequestError;
  }
}

app.post('/api/login', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = decodeCredential(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    res.json({
      user_id: userController.user.userID,
      email: userController.user.email,
      user_name: userController.user.user_name,
      avatar: userController.user.avatar,
      phone: userController.user.phone
    });
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

app.post('/api/profile', async (req, res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
      return res.send("Server Unavailable");
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  const mode = req.body.mode;
  const email = req.body.email;
  const user_name = req.body.user_name;
  const avatar = req.body.avatar;
  const phone = req.body.phone;
  const user_password = req.body.user_password;

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);
      const user = await userController.userEditProfile(mode, email, user_name, avatar, phone, userPassword, user_password);

      res.json({user: user})
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({error: error.message});
    } else {
        const internalServerError = new Error('Internal Server Error');
        internalServerError = 500;
        throw internalServerError;
    }
  }
});

app.get('/api/contact', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  if (userEmail === undefined || userPassword === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const name = req.query.name;
  if (name === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
    return;
  }

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);

      const contacts = await userController.getUserContacts(name);
      res.json({contacts: contacts});
  } catch (error) {
      if (error.status) {
        res.status(error.status).json({error: error.message});
      } else {
        res.status(500).json({error: 'Internal Server Error'});
      }
  }
});

app.post('/api/contact', async (req,res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const body = req.body;
    const mode = body.mode;
    const contact_id = body.contact_id;

    if (mode === undefined || contact_id === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (mode !== 'add' && mode !== 'del') {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (isNaN(contact_id) === true) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    if (mode === 'add') {
      const manageContactResult = await userController.userAddContact(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Contact Successfully Added' });
    } else if (mode === 'del') {
      const manageContactResult = await userController.userDeleteContact(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Contact Successfully Deleted' });
    }
  } catch (error) {
    res.status(error.status).json({error: error.message});
  }
});

app.get('/api/user', async (req,res) => {
  const name = req.query.name;
  if (name === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      const users = await userController.userSearchUser(name);
      res.json({users: users});
  } catch (error) {
      if (error.status) {
        res.status(error.status).json({error: error.message});
      } else {
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'});
      }
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const body = req.body;
    const mode = body.mode;
    const contact_id = body.contact_id;
    const blockStatus = body.blockStatus;

    if (mode === undefined || contact_id === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (mode !== 'block' && mode !== 'report') {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (isNaN(contact_id) === true) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    if (mode === 'block') {
      if (blockStatus === undefined) {
        const badRequestError = new Error('Bad Request');
        badRequestError.status = 400;
        res.status(badRequestError.status).json({error: badRequestError.message});
      }

      if (isNaN(blockStatus) === true) {
        const badRequestError = new Error('Bad Request');
        badRequestError.status = 400;
        res.status(badRequestError.status).json({error: badRequestError.message});
      }

      const manageContactResult = await userController.userSetBlockStatus(parseInt(blockStatus), parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Block Status Successfully Changed' });
    } else if (mode === 'report') {
      const manageContactResult = await userController.userReport(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'User Successfully Reported' });
    }
  } catch (error) {
    if (error.status !== undefined) {
      res.status(error.status).json({error: error.message});
    } else {
      console.log(error);
      const internalServerError = new Error('Internal Server Error');
      internalServerError.status = 500;
      res.status(internalServerError.status).json({error: internalServerError.message});
    }
  }
});

app.get('/api/statistic', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  if (userEmail === undefined || userPassword === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);

      const statistic = await userController.getUserStatistic();
      res.json({statistic: statistic});
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

app.get('/api/education', async (req,res) => {
  const mode = req.query.mode;
  const id = req.query.id;

  if (mode === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  if (mode !== 'title' && mode !== 'content') {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const educationController = new Education_Controller();

      if (mode === 'title') {
        const titles = await educationController.getEducationalTitles();
        res.json({titles: titles});
      }

      if (mode === 'content') {
        if (id === undefined) {
          const badRequestError = new Error('Bad Request');
          badRequestError.status = 400;
          res.status(badRequestError.status).json({error: badRequestError.message});
        }

        if (isNaN(id) === true) {
          const badRequestError = new Error('Bad Request');
          badRequestError.status = 400;
          res.status(badRequestError.status).json({error: badRequestError.message});
        }

        const contents = await educationController.getEducationalContents(parseInt(id));
        res.json({contentBody: contents});
      }
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

app.post('/api/communication', async (req,res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      res.status(403).json({error: 'Bad Request'});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    const body = req.body;

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    const room_id = await userController.handleCommunication(body, clients);

    res.status(200).json({room_id: room_id});
    
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal Server Error"});
    }
  }
}) 

const getServerTime = () => {
  // Get the current date and time
  const currentDate = new Date();

  // Extract date and time components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getSeconds()).padStart(2, '0');

  return ({
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second
  })
};

async function saveAudioRecordToFile(message, clientID) {
  const serverTime = getServerTime();

  const buffer = Buffer.from(message, 'binary');

  const audioStream = new Readable();
  audioStream.push(buffer);
  audioStream.push(null);

  const fileName = `C${clientID}T${serverTime.year}${serverTime.month}${serverTime.day}${serverTime.hour}${serverTime.minute}${serverTime.second}.flac`;
  const filePath = path.join(__dirname, 'audio_files', fileName); // __dirname gives the directory of the current module

  ffmpeg(audioStream)
  .audioChannels(1)
  .outputFormat('flac')
  .on('error', (err) => {
      console.error('Error during conversion:', err);
  })
  .on('end', () => {
    console.log('Conversion Complete - File Name: ' + fileName);
  }).save(filePath);
  
  return fileName;
};

async function runModel(clientID, fileName, room_id, deepfake_status) {
  const pythonScriptPath = 'main.py';

  const filePath = 'audio_files/' + fileName;

  const command = `python ${pythonScriptPath} --single_file ${filePath}`;

  exec(command, async (error, stdout, stderr) => {
      if (error) {
          console.error(`Error analysing file: ${error.message}`);
          return 'Can Not Open File';
      }

      if (stderr) {
          console.error(`Python script error: ${stderr}`);
          return 'Internal Server Error';
      }

      const evaluatedScore = parseFloat(stdout);

      if (parseFloat(evaluatedScore) > 1.5) {
        console.log(`File ${fileName} is suspected of deepfake with score = ${parseFloat(evaluatedScore)}`);
    
        try{
          clients.forEach((client) => {
            if (client.id === clientID && client.readyState === WebSocket.OPEN) {
              const messageObj = {
                mode: 'analyse',
                result: 'deepfake'
              }
              client.deepfake = true;
              client.send(JSON.stringify(messageObj));
            }
          });

          if (deepfake_status === false) {
            await Call_History.flagCallHistory(true, clientID, room_id);
            console.log(`Call Flagged For User ${clientID} In Room ${room_id}`);
          }
        } catch (error) {
            console.log('Error occured while transmitting message to client with id: ' + clientID);
        }
      }
  });
};

async function analyse(clientID, message, room_id, deepfake_status) {
  let processedID = clientID;
  /*if (processedID < 0) {
    processedID *= -1;
  }*/
  const fileName = await saveAudioRecordToFile(message, processedID);
  await runModel(processedID, fileName, room_id, deepfake_status);
}

const clients = [];

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    if (isNaN(message) === true) {
      try {
        analyse(ws.id, message, ws.room, ws.deepfake);
      } catch (error) {
        console.log(error.message);
      }
    } else if (isNaN(message) === false) {
      let data = parseInt(message);
      ws.id = data;
      console.log(`WebSocket with ID: ${ws.id} connected`);
    }
  })

  ws.on('close', () => {
    console.log(`WebSocket with ID: ${ws.id} disconnected`);
    clients.splice(clients.indexOf(ws), 1);
  });

  clients.push(ws);
});

server.listen(server_main_port, function() {
  console.log("Server Main Online - Port: " + server_main_port);
});