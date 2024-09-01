import { useState, useEffect } from 'react';
import AdminCall from '../Components/AdminCall';
import Gate from '../Components/Gate';

const app_config = require('../app-config')

const Admin = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [renderCallScreen, setRenderCallScreen] = useState(false);
  const [user, setUser] = useState(null);
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    const parseWebsocketMessage = (jsonMessage) => {
      try {
        return JSON.parse(jsonMessage);
      } catch (error) {
        alert('Error In Parse: ' + error);
      }
    }

    if (user !== null) {
      try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send(user.user_id);
          setRenderCallScreen(true)
        };
        ws.onmessage = (message) => {
          const messageObj = parseWebsocketMessage(message.data);
          if (messageObj && messageObj.mode === 'incoming') {
            setIncoming(messageObj);
          } else if (messageObj && messageObj.mode === 'decline') {
            alert('Call Declined');
          }
        }
        setWebSocket(ws);
      } catch (error) {
          console.error('Error connecting WebSocket:', error);
      }
    }

    if (user === null) {
      setWebSocket(null)
    }
  }, [user]);

  useEffect(() => {
    if (webSocket === null) {
      setRenderCallScreen(false);
    }
  }, [webSocket])

  return (
    <div class="flex items-center justify-center w-full h-full">
      {renderCallScreen === false && <Gate setUser={setUser}/>}
      {renderCallScreen === true && <AdminCall user={user} setUser={setUser} webSocket={webSocket} incoming={incoming} setIncoming={setIncoming}/>}
    </div>
  );
};

export default Admin;