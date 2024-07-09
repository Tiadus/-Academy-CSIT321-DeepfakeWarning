const APP_CONFIG = require('../app-config');
const server_main_port = APP_CONFIG.server_main_port;
const server_model_http = APP_CONFIG.server_model_http;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const clients = [];

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    if (isNaN(message) === true) {
      const clientRecord = {
        clientID: ws.id,
        clientRecord: message
      }
  
      try {
        await axios.post(server_model_http + '/api/analyse', clientRecord);
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
    console.log('Client disconnected');
    clients.splice(clients.indexOf(ws), 1);
  });

  clients.push(ws);
});

app.post('/api/model_response', async (req,res) => {
  const body = req.body;
  const result = body.result;
  console.log (body);
  clients.forEach((client) => {
    if (client.id === body.clientID && client.readyState === WebSocket.OPEN) {    
      if (result === 0) {
        client.send('Deepfake');
      }

      if (result === 1) {
        client.send('Safe');
      }
    }
  });
  res.send('Result Received');
});

server.listen(server_main_port, function() {
  console.log("Server Main Online");
});