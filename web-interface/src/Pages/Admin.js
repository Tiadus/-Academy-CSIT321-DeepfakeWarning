import { useState, useEffect } from 'react';
import AdminCall from '../Components/AdminCall';
import Gate from '../Components/Gate';

const app_config = require('../app-config')

const Admin = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [renderCallScreen, setRenderCallScreen] = useState(false)
  const [clientID, setClientID] = useState(null);

  useEffect(() => {
    if (clientID !== null) {
      try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send(clientID);
          setRenderCallScreen(true)
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
      setRenderCallScreen(false);
    }
  }, [webSocket])

  return (
    <div class="container d-flex justify-content-center align-items-center" style={{width: '100%', height: '100%'}}>
      {renderCallScreen === false && <Gate setClientID={setClientID}/>}
      {renderCallScreen === true && <AdminCall clientID={clientID} webSocket={webSocket} setWebSocket={setWebSocket}/>}
    </div>
  );
};

export default Admin;