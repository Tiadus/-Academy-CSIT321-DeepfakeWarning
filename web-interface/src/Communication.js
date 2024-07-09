import { useState, useEffect } from 'react';
import axios from "axios";
const app_config = require('./app-config.js');

const Communication = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [webSocket, setWebSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [intervalID, setIntervalID] = useState(null);

  useEffect(() => {
    const startRecording = () => {
      if (intervalID === null) {
        if (isRecording === true) {
          setIntervalID(setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
          },5000))
        }
      }
    }
    startRecording();
  }, [mediaRecorder])

  const handleInitiateCall = async () => {
    try {
      console.log("Recording Start");
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(micStream);
      const mediaRecorderInstance = new MediaRecorder(micStream);
  
      mediaRecorderInstance.ondataavailable = (e) => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(e.data);
        }
      };
  
      mediaRecorderInstance.start();
  
      setIsRecording(true);
      setMediaRecorder(mediaRecorderInstance);
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  };

  const handleTerminateCall = () => {
    if (intervalID !== null) {
      clearInterval(intervalID);
      setIntervalID(null);
    }

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

    setIsRecording(false);
  };

  const handleLogin = async () => {
    try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send("1");
        };
        ws.onmessage = (message) => {
          console.log(message.data);
        }
        setWebSocket(ws);
    } catch (error) {
        console.error('Error connecting WebSocket:', error);
    }
  };

  const handleDisconnectWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  return (
    <div>
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
        <div>
            <button onClick={handleInitiateCall} disabled={isRecording}>Initial Call</button>
        </div>
        <div>
            <button onClick={handleTerminateCall} disabled={!isRecording}>Hangup Call</button>
        </div>
    </div>
  );
};

export default Communication;