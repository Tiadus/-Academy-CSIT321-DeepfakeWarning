import { useState, useEffect } from 'react';
import ClientCall from '../Components/ClientCall';

const app_config = require('../app-config')

const Client = ({}) => {
  const [webSocket, setWebSocket] = useState({});
  const [callProcess, setCallProcess] = useState({});
  const [socketOpen, setSocketOpen] = useState(false);
  const [callStatus, setCallStatus] = useState('e');

  useEffect(() => {
    document.addEventListener("message", function (event) {
      const reactNativeInput = JSON.parse(event.data);
      setCallProcess(reactNativeInput);
    });
  }, []);

  useEffect(() => {
    const openWebSocket = async (webSocketID) => {
      try {
        const ws = new WebSocket(app_config.server_main_ws);
        ws.onopen = () => {
          ws.send(webSocketID);
          setSocketOpen(true);
        };
        ws.onmessage = (message) => {
          console.log(message.data);
          setCallStatus('d');
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
      background: 'linear-gradient(135deg, #0A256A 0%, #020003 50%, #460A6A 100%)',
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