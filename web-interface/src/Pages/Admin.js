import { useState, useEffect } from 'react';
import AdminCall from '../Components/AdminCall';
import Gate from '../Components/Gate';

const app_config = require('../app-config')

const Admin = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [renderCallScreen, setRenderCallScreen] = useState(false);
  const [user, setUser] = useState(null);
  const [incoming, setIncoming] = useState(null);

  /**
   * useEffect to manage WebSocket connection for handling incoming calls.
   * 
   * This effect establishes a WebSocket connection to the server when a user is logged in.
   * It sends the user's ID upon successful connection and sets a flag to render the call screen.
   * 
   * The effect includes a message parser function that attempts to parse incoming WebSocket messages.
   * If parsing fails, an alert is displayed with the error.
   * 
   * When a message is received, it checks the mode of the message:
   * - If the mode is 'incoming', it updates the state to reflect an incoming call.
   * - If the mode is 'decline', it alerts the user that the call has been declined.
   * 
   * If the user is logged out (user is null), the WebSocket connection is cleared.
   * 
   * Dependencies:
   * - user: The current logged-in user.
   * - app_config.server_main_ws: The WebSocket server URL.
   * - setIncoming: A state setter function to update incoming call state.
   * - setRenderCallScreen: A state setter function to render the call screen.
   * - setWebSocket: A state setter function to manage the WebSocket connection.
   */
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

  /**
   * useEffect to manage the visibility of the call screen based on WebSocket connection status.
   * 
   * This effect checks if the WebSocket connection is null (i.e., disconnected). 
   * If it is null, it updates the state to hide the call screen by setting `renderCallScreen` to false.
   * 
   * Dependencies:
   * - webSocket: The current WebSocket connection.
   * - setRenderCallScreen: A state setter function to control the rendering of the call screen.
   */
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