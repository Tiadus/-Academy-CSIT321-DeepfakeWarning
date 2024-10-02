import { useState, useEffect } from 'react';
import ClientCall from '../Components/ClientCall';

const app_config = require('../app-config')

const Client = ({}) => {
  const [webSocket, setWebSocket] = useState({});
  const [callProcess, setCallProcess] = useState({});
  const [socketOpen, setSocketOpen] = useState(false);
  const [callStatus, setCallStatus] = useState('e');

  /**
   * useEffect to handle incoming messages from a React Native WebView.
   * 
   * This effect sets up an event listener for the "message" event, which is triggered when a message
   * is received from the React Native WebView. The received message is expected to be a JSON string,
   * which is parsed and used to update the `callProcess` state.
   * 
   * Dependency: The effect runs only once when the component mounts (empty dependency array).
   * 
   * - `setCallProcess`: A state setter function to update the call process state based on the received message.
   */
  useEffect(() => {
    document.addEventListener("message", function (event) {
      const reactNativeInput = JSON.parse(event.data);
      setCallProcess(reactNativeInput);
    });
  }, []);

  /**
   * useEffect to manage WebSocket connections based on the call process state.
   * 
   * This effect sets up a WebSocket connection when `callProcess.mode` is defined. It defines an inner 
   * function `openWebSocket` that handles the WebSocket connection logic, including:
   * 
   * - Connecting to the WebSocket server.
   * - Sending the user's WebSocket ID when the connection is opened.
   * - Handling incoming messages to update the call status or alert the user about a declined call.
   * - Handling errors and connection closure.
   * 
   * If `callProcess.mode` is not valid, an alert is triggered. The effect runs whenever the `callProcess` state changes.
   * 
   * - `parseWebsocketMessage`: A helper function to parse incoming WebSocket messages and handle parsing errors.
   * - `setWebSocket`: A state setter function to store the WebSocket instance.
   * - `setCallStatus`: A state setter function to update the call status based on incoming messages.
   */
  useEffect(() => {
    const parseWebsocketMessage = (jsonMessage) => {
      try {
        return JSON.parse(jsonMessage);
      } catch (error) {
        alert('Error In Parse: ' + error);
      }
    }

    const openWebSocket = async (webSocketID) => {
      try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send(webSocketID);
          setSocketOpen(true);
        };
        ws.onmessage = (message) => {
          const messageObj = parseWebsocketMessage(message.data);
          if (messageObj && messageObj.mode === 'analyse') {
            setCallStatus('d');
          } else if (messageObj && messageObj.mode === 'decline') {
            alert('Call Declined');
            if(window.ReactNativeWebView) { // ensure window.ReactNativeWebView is there, otherwise, web app might crash if is not there
              window.ReactNativeWebView.postMessage('End Call');
            }
          }
        }
        ws.onerror = (message) => {
          alert(message.data);
        }
        ws.onclose = (message) => {
          alert('Close');
        }
        setWebSocket(ws);
      } catch (error) {
          alert('Error connecting WebSocket:', error);
      }
    }

    if (callProcess.mode) {
      const webSocketID = '-' + callProcess.user.user_id;
      if (isNaN(webSocketID) === true) {
          alert('Invalid Input: ' + webSocketID);
      } else {
          try {
            openWebSocket(webSocketID);
          } catch (error) {
              alert('An Error Has Occured!');
          }
      }
    }
  }, [callProcess])

  return (
    <div class="w-full h-full"
    style={{
      background: 'linear-gradient(135deg, #0A256A, #0F1A36, #061539)'
    }}
    >
      {!webSocket.readyState && 
        <div class='flex flex-col gap-y-7 items-center justify-center w-full h-full'>
          <div class='text-2xl text-[#F1F1F1]'>
            Can Not Establish Connection!
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-dark btn-lg btn-group d-flex justify-content-center align-items-center" 
              onClick={() => {
                if(window.ReactNativeWebView) { // ensure window.ReactNativeWebView is there, otherwise, web app might crash if is not there
                  window.ReactNativeWebView.postMessage('End Call');
                }
              }}
            >
              Back
            </button>
          </div>
        </div>
      }
      {socketOpen === true && 
        <ClientCall
          callProcess={callProcess}
          webSocket={webSocket} 
          setWebSocket={setWebSocket}
          callStatus={callStatus}
          setCallStatus={setCallStatus}
        />
      }
    </div>
  );
};

export default Client;