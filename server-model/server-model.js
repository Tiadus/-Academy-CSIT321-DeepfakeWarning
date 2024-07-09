const APP_CONFIG = require('../app-config');
const server_model_port = APP_CONFIG.server_model_port;
const server_main_http = APP_CONFIG.server_main_http

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Require the path module
const axios = require('axios');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

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
}

async function saveAudioRecordToFile(message) {
    const serverTime = getServerTime();

    const buffer = Buffer.from(message, 'binary');

    const audioStream = new Readable();
    audioStream.push(buffer);
    audioStream.push(null);

    const fileName = `C1T${serverTime.year}${serverTime.month}${serverTime.day}${serverTime.hour}${serverTime.minute}${serverTime.second}.flac`;
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
}

async function runModel(fileName) {
    return new Promise((resolve) => {
        setTimeout(() => {
          const result = Math.random() < 0.5 ? 0 : 1;
          resolve(result);
        }, 3000);
      });
}

async function analyse(clientID, message) {
    const fileName = await saveAudioRecordToFile(message);
    const result = await runModel(fileName);
    const body = {
        clientID: clientID,
        result: result
    }

    const returnMessage = await axios.post(server_main_http + '/api/model_response', body);
}

app.post('/api/analyse', async (req,res) => {
    const body = req.body;
    const clientID = body.clientID;
    const clientRecord = body.clientRecord;

    if (clientRecord === undefined) {
        const error = new Error('Bad Request');
        error.status = 400;
        res.status(error.status).json({error: error.message});
    }

    analyse(clientID, clientRecord.data);

    res.send('Record Received')
});

server.listen(server_model_port, function() {
    console.log("Server Model Online");
});