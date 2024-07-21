import { useState, useEffect } from 'react';
import Gate from '../Components/Gate';
import VoiceCall from '../Components/VoiceCall';

const app_config = require('../app-config.js');

const Test = () => {
    const [clientID, setClientID] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
  
    useEffect(() => {
      if (clientID !== null) {
        try {
          const ws = new WebSocket(app_config.server_main_ws);
          ws.onopen = () => {
            ws.send(clientID);
          };
          ws.onmessage = (message) => {
            console.log(message.data);
          }
          setWebSocket(ws);
        } catch (error) {
            console.error('Error connecting WebSocket:', error);
        }
      }
    }, [clientID]);
  
    useEffect(() => {
      if (webSocket === null) {
        setClientID(null);
      }
    }, [webSocket])
  
    return (
      <div className="App">
        {webSocket === null && <Gate setClientID={setClientID}/>}
        {webSocket !== null && <VoiceCall clientID={clientID} webSocket={webSocket} setWebSocket={setWebSocket}/>}
      </div>
    );
};

export default Test;