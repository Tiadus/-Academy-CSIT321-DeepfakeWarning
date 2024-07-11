const APP_CONFIG = require('../app-config');
const server_main_port = APP_CONFIG.server_main_port;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

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
  const filePath = path.join(__dirname, 'audio', fileName); // __dirname gives the directory of the current module

  ffmpeg(audioStream)
  .outputFormat('flac')
  .on('error', (err) => {
      console.error('Error during conversion:', err);
  })
  .on('end', () => {
  console.log('Conversion to FLAC successful!');
  }).save(filePath);

  return fileName;
};

async function analyse(clientID, message) {
  const fileName = await saveAudioRecordToFile(message, clientID);
  const result = await runModel(fileName);

  if (result === 1) {
      try{
        clients.forEach((client) => {
          if (client.id === clientID && client.readyState === WebSocket.OPEN) {    
            if (result === 1) {
              client.send('Deepfake');
            }
          }
        });
      } catch (error) {
          console.log('Error Occured');
      }
  }
}

async function runModel(fileName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 0 : 1;
      resolve(result);
    }, 3000);
  });
};

const clients = [];

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    if (isNaN(message) === true) {
      try {
        analyse(ws.id, message);
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