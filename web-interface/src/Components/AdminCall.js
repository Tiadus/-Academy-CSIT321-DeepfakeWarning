import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AdminIncallModal from './AdminIncallModal';
const config = require('../app-config')

const AdminCall = ({clientID, webSocket, setWebSocket}) => {
  const [status, setStatus] = useState('Ringing');
  const [modalIncallShow, setModalIncallShow] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [intervalID, setIntervalID] = useState(null);
  const [rtcClient, setRtcClient] = useState(null);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: []
  });
  const [audioInputType, setAudioInputType] = useState('mic'); //file
  
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

          setModalIncallShow(false);
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
            setStatus('Incall');
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

    useEffect(() => {
      if (modalIncallShow === false) {
        if (rtcClient !== null) {
          if (audioTracks.localAudioTrack !== null) {
            audioTracks.localAudioTrack.stop();
            audioTracks.localAudioTrack.close();
          }

          rtcClient.unpublish();
          rtcClient.leave();
        }
      }
    }, [modalIncallShow])
  
    let initRtc = async () => {
      await rtcClient.join(config.appId, config.channel, config.token, clientID);
  
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setAudioTracks(prevState => ({
        ...prevState,
        localAudioTrack: localAudioTrack
      }));

      setModalIncallShow(true);
    }

    const handleInputSwitchToMicrophone = async () => {
      audioTracks.localAudioTrack.stopProcessAudioBuffer();
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
  
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setAudioTracks(prevState => ({
        ...prevState,
        localAudioTrack: localAudioTrack
      }));
  
      setAudioInputType('mic');
    }
  
    const handleInputSwitchToAudioFile = async () => {
      const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
        source: '/audiofiles/sample.flac'
      });
  
      fileAudioTrack.startProcessAudioBuffer();
  
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
  
      setAudioTracks(prevState => ({
        ...prevState,
        localAudioTrack: fileAudioTrack
      }));
  
      setAudioInputType('file');
    }
  
    const handleAnswerWithAudioFile = async () => {
      await rtcClient.join(config.appId, config.channel, config.token, clientID);
  
      const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
        source: '/audiofiles/fake_sample.mp3'
      });
  
      fileAudioTrack.startProcessAudioBuffer();
  
      setAudioTracks(prevState => ({
        ...prevState,
        localAudioTrack: fileAudioTrack
      }));

      setAudioInputType('file');
      setStatus('Incall');
      setModalIncallShow(true);
    }

    let endCall = async () => {
      if (isRecording === true) {
        setIsRecording(false);
      } else if (isRecording === false) {
        setModalIncallShow(false);
      }
      setStatus('Ringing');
    }
  
    const handleLogout = () => {
      webSocket.close();
      setWebSocket(null);
    };

    return (
        <div 
            class="row gy-3"
            style={{textAlign: 'center'}}
        >
          <AdminIncallModal
            show={modalIncallShow}
            status={status}
            onHide={() => setModalIncallShow(false)}
            endCall={endCall}
            audioInputType={audioInputType}
            switchToMic={handleInputSwitchToMicrophone}
            switchToFile={handleInputSwitchToAudioFile}
          />
          <div class="col-12 d-flex justify-content-center align-items-center">
              <input 
                  type="text" 
                  id="inputField" 
                  class="form-control mb-3" 
                  style={{textAlign: 'center', borderColor: 'violet', borderWidth: '4px', borderStyle: 'solid', borderRadius: '30px'}} 
                  placeholder="Enter A Number"
              />
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center">
              <button 
                  type="button" 
                  class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
                  style={{width: '85%', textAlign: 'center', clear: 'left'}}
                  id="call-button"
                  onClick={initRtc}
              >
                <span>Call</span>
              </button>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center">
              <button 
                  type="button" 
                  class="btn btn-primary btn-lg btn-group d-flex justify-content-center align-items-center" 
                  style={{width: '85%', textAlign: 'center', clear: 'left'}}
                  id="call-button"
                  onClick={handleAnswerWithAudioFile}
              >
                <span>Answer With Audio File</span>
              </button>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center">
              <button 
                  type="button" 
                  class="btn btn-dark btn-lg btn-group d-flex justify-content-center align-items-center" 
                  style={{width: '85%', textAlign: 'center', clear: 'left'}}
                  id="call-button"
                  onClick={handleLogout}
              >
                <span>Logout</span>
              </button>
          </div>
        </div>
    );
};

export default AdminCall;