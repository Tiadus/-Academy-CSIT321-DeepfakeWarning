import { useState, useEffect} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
const config = require('../app-config')

const ClientCall = ({clientID, webSocket}) => {
  const [incall, setIncall] = useState(false);
  const [status, setStatus] = useState('Ringing');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [intervalID, setIntervalID] = useState(null);
  const [rtcClient, setRtcClient] = useState(null);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: []
  });
  
  useEffect(() => {
    const startRecording = () => {
      if (intervalID === null) {
        if (isRecording === true) {
          setIntervalID(setInterval(() => {
            if (mediaRecorder) {
              mediaRecorder.stop();
            }
            if (mediaRecorder) {
              mediaRecorder.start();
            }
          },5000))
        }
      }
    }

    if (isRecording === false) {
      if (intervalID !== null) {
        clearInterval(intervalID);
        setIntervalID(null);

        if (mediaRecorder) {
          mediaRecorder.stop();
        }

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }

        if (audioTracks.localAudioTrack !== null) {
          audioTracks.localAudioTrack.stop();
          audioTracks.localAudioTrack.close();
        }
        
        rtcClient.unpublish();
        rtcClient.leave();

        if(window.ReactNativeWebView) { //Ensure window.ReactNativeWebView is there to prevent crashing
          window.ReactNativeWebView.postMessage('End Call');
        }
      }
    }
  
      if (isRecording === true) {
        startRecording();
      }
    }, [isRecording]);
  
  const recordAudioStream = (audioTrack) => {
    const mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]));

    mediaRecorder.ondataavailable = (e) => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(e.data);
      }
    };
  
    mediaRecorder.onstop = () => {
      //Place Holder
    };
  
    mediaRecorder.start();
  
    setIsRecording(true);
    setMediaRecorder(mediaRecorder);
  };
  
  useEffect(() => {
    if (rtcClient === null) {
      const rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'});

      const handleUserJoined = async (user) => {
        //Place Holder
      }
    
      const handleUserPublished = async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);
    
        if (mediaType === 'audio') {
          let temp = audioTracks.remoteAudioTracks;
          temp[user.uid] = [user.audioTrack];

          setAudioTracks(prevState => ({
            ...prevState,
            remoteAudioTracks: temp
          }));

          user.audioTrack.play();
          setStatus('Incall')
          recordAudioStream(user.audioTrack.mediaStreamTrack);
        }
      }

      let handleUserLeft = async (user) => {
        delete audioTracks.remoteAudioTracks[user.uid];
    
        setIsRecording(false);
      }
  
      rtcClient.on('user-joined', handleUserJoined);
      rtcClient.on('user-published', handleUserPublished);
      rtcClient.on("user-left", handleUserLeft);

      setRtcClient(rtcClient);
    }
  }, []);
  
  useEffect(() => {
    if (audioTracks.localAudioTrack !== null) {
      rtcClient.publish(audioTracks.localAudioTrack);
    }
  }, [audioTracks.localAudioTrack]);

  let initRtc = async () => {
    try {
      await rtcClient.join(config.appId, config.channel, config.token, clientID);
      setIncall(true);
    } catch(error) {
      alert('Error In Joining!');
    }

    //Option To Get The Client Microphone When Communicating Through HTTPS
    /*const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setAudioTracks(prevState => ({
      ...prevState,
      localAudioTrack: stream
    }));*/
  }

  const endCall = () => {
      if (isRecording === true) {
          setIsRecording(false);
      } else if (isRecording === false) {
          if(window.ReactNativeWebView) { //Ensure window.ReactNativeWebView is there to prevent crashing
              window.ReactNativeWebView.postMessage('End Call');
          }
      }
  };

  return (
    <div>
      {incall === false &&
        <button 
          class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
          onClick={initRtc}
        >
          Call
        </button>
      }
      {incall === true && 
        <div>
          <div style={{textAlign: "center"}}>
            {status}
          </div>
          <button class="btn btn-danger btn-lg btn-group d-flex justify-content-center align-items-center" 
            onClick={endCall}
          >
            End Call
          </button>
        </div>
      }
    </div>
  );
};

export default ClientCall;