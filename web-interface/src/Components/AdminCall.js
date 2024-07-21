import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AdminIncallModal from './AdminIncallModal';
const config = require('../app-config')

const AdminCall = ({clientID, webSocket, setClientID}) => {
  const [rtcClient, setRtcClient] = useState(null);

  const [adminCallState, setAdminCallState] = useState({
    localAudioTrack: null,
    remoteAudioTrack: null,
    modalIncallShow: false,
    callStatus: 'Ringing',
    mediaRecorder: null,
    interval: null,
    audioInputType: 'mic'
  })

  useEffect(() => {
    if (rtcClient === null) {
      const rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'});

      const handleUserJoined = async (user) => {
        //Place Holder
        setAdminCallState(prevState => ({
          ...prevState,
          callStatus: 'Incall'
        }))
      }
    
      const handleUserPublished = async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);
    
        if (mediaType === 'audio') {
          user.audioTrack.play();

          const mediaRecorder = new MediaRecorder(new MediaStream([user.audioTrack.mediaStreamTrack]));
  
          mediaRecorder.ondataavailable = (e) => {
            if (webSocket && webSocket.readyState === WebSocket.OPEN) {
              webSocket.send(e.data);
            }
          };
        
          mediaRecorder.onstop = () => {
            //Place Holder
          };

          setAdminCallState(prevState => ({
            ...prevState,
            remoteAudioTrack: user.audioTrack,
            mediaRecorder: mediaRecorder
          }))
        }
      }

      let handleUserLeft = async (user) => {
        try{
          if (adminCallState.mediaRecorder) {
            adminCallState.mediaRecorder.stop();
          }

          setAdminCallState(prevState => ({
            ...prevState,
            remoteAudioTrack: null,
            modalIncallShow: false
          }))
        } catch(error) {
          console.log(error);
        }
      }
  
      rtcClient.on('user-joined', handleUserJoined);
      rtcClient.on('user-published', handleUserPublished);
      rtcClient.on("user-left", handleUserLeft);

      setRtcClient(rtcClient);
    }
  }, [rtcClient, webSocket, adminCallState.mediaRecorder]); //NOTE []

  useEffect(() => {
    if (adminCallState.localAudioTrack !== null) {
      rtcClient.publish(adminCallState.localAudioTrack);
    }
  }, [adminCallState.localAudioTrack, rtcClient]); //NOTE adminCallState.localAudioTrack

  useEffect(() => {
    if (adminCallState.mediaRecorder !== null && adminCallState.mediaRecorder.state === 'inactive') {
      adminCallState.mediaRecorder.start();

      setAdminCallState(prevState => ({
        ...prevState,
        interval: setInterval(() => {
          adminCallState.mediaRecorder.stop();
          adminCallState.mediaRecorder.start();
        },5000)
      }))
    }

    if (adminCallState.mediaRecorder === null) {
      if (adminCallState.interval !== null) {
        clearInterval(adminCallState.interval);
        setAdminCallState(prevState => ({
          ...prevState,
          interval: null
        }));
      }
    }
  }, [adminCallState.mediaRecorder, adminCallState.interval]); //NOTE adminCallState.mediaRecorder

  useEffect(() => {
    if (adminCallState.modalIncallShow === false) {
      if (rtcClient !== null) {
        if (rtcClient.localTracks.length !== 0) {
          rtcClient.unpublish();
          rtcClient.leave();
        }

        if (adminCallState.interval !== null) {
          clearInterval(adminCallState.interval)
        }
  
        if (adminCallState.mediaRecorder !== null && adminCallState.mediaRecorder.state === 'recording') {
          adminCallState.mediaRecorder.stop();
        }

        if (adminCallState.localAudioTrack !== null) {
          if (adminCallState.audioInputType === 'file') {
            adminCallState.localAudioTrack.stopProcessAudioBuffer();
          }
          adminCallState.localAudioTrack.stop();
          adminCallState.localAudioTrack.close();

          setAdminCallState(prevState => ({
            ...prevState,
            localAudioTrack: null,
            remoteAudioTrack: null,
            interval: null,
            mediaRecorder: null,
          }))
        }
      }
    }
  }, [adminCallState.modalIncallShow, adminCallState.localAudioTrack, 
      adminCallState.remoteAudioTrack, adminCallState.audioInputType,
      rtcClient, adminCallState.mediaRecorder, adminCallState.interval]) //NOTE adminCallState.modalIncallShow

  let initRtc = async () => {
    await rtcClient.join(config.appId, config.channel, config.token, clientID);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setAdminCallState(prevState => ({
      ...prevState,
      localAudioTrack: localAudioTrack,
      modalIncallShow: true
    }))
  }

  const handleInputSwitchToMicrophone = async () => {
    adminCallState.localAudioTrack.stopProcessAudioBuffer();
    adminCallState.localAudioTrack.stop();
    adminCallState.localAudioTrack.close();

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setAdminCallState(prevState => ({
      ...prevState,
      localAudioTrack: localAudioTrack,
      audioInputType: 'mic'
    }))
  }

  const handleInputSwitchToAudioFile = async () => {
    const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
      source: '/audiofiles/sample.flac'
    });

    fileAudioTrack.startProcessAudioBuffer();

    adminCallState.localAudioTrack.stop();
    adminCallState.localAudioTrack.close();

    setAdminCallState(prevState => ({
      ...prevState,
      localAudioTrack: fileAudioTrack,
      audioInputType: 'file'
    }))
  }

  const handleAnswerWithAudioFile = async () => {
    await rtcClient.join(config.appId, config.channel, config.token, clientID);

    const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
      source: '/audiofiles/fake_sample.mp3'
    });

    fileAudioTrack.startProcessAudioBuffer();

    setAdminCallState(prevState => ({
      ...prevState,
      localAudioTrack: fileAudioTrack,
      audioInputType: 'file',
      callStatus: 'Incall',
      modalIncallShow: true
    }))
  }

  let endCall = async () => {
    try{
      setAdminCallState(prevState => ({
        ...prevState,
        modalIncallShow: false,
        callStatus: 'Ringing'
      }))
    } catch(error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    webSocket.close();
    setClientID(null);
  };

  return (
      <div 
          class="row gy-3"
          style={{textAlign: 'center'}}
      >
        <AdminIncallModal
          show={adminCallState.modalIncallShow}
          status={adminCallState.callStatus}
          onHide={() => {
            setAdminCallState(prevState => ({
              ...prevState,
              modalIncallShow: false
            }))
          }}
          endCall={endCall}
          audioInputType={adminCallState.audioInputType}
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