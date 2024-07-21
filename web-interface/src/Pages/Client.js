import { useState, useEffect } from 'react';
import ClientCall from '../Components/ClientCall';

const app_config = require('../app-config')

const Client = ({}) => {
  const [webSocket, setWebSocket] = useState(null);
  const [clientID, setClientID] = useState(0);
  const [wsError, setWsError] = useState(false);

  useEffect(() => {
    const openWebSocket = async (clientID, webSocketID) => {
      try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send(webSocketID);
          setClientID(clientID);
        };
        ws.onmessage = (message) => {
          console.log(message.data);
        }
        ws.onerror = (message) => {
          setWsError(true);
        }
        ws.onclose = (message) => {
          alert('Close');
          setWsError(true);
        }
        setWebSocket(ws);
      } catch (error) {
          alert('Error connecting WebSocket:', error);
      }
    }

    document.addEventListener("message", function (event) {
      const reactNativeInput = event.data.split(',');
      const clientID = reactNativeInput[0]
      const webSocketID = '-' + clientID;
      if (isNaN(webSocketID) === true) {
          alert('Invalid Input: ' + webSocketID);
      } else {
          try {
            openWebSocket(clientID, webSocketID);
          } catch (error) {
              alert('An Error Has Occured!');
          }
      }
    });
  }, []);

  return (
    <div class="container d-flex justify-content-center align-items-center" style={{width: '100%', height: '100%'}}>
      {wsError === true && 
        <div>
          <div>
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
      {clientID !== 0 && <ClientCall clientID={clientID} webSocket={webSocket} setWebSocket={setWebSocket}/>}
    </div>
  );
};

export default Client;