import axios from 'axios';
import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AdminIncallModal from './AdminIncallModal';
import AdminIncomingModal from './AdminIncomingModal';
const config = require('../app-config');

const AdminCall = ({user, setUser, webSocket, incoming, setIncoming}) => {
  const [rtcClient, setRtcClient] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [adminCallState, setAdminCallState] = useState({
    localAudioTrack: null,
    remoteAudioTrack: null,
    modalIncallShow: false,
    modalIncomingShow: false,
    callStatus: 'Ringing',
    mediaRecorder: null,
    interval: null,
    audioInputType: 'mic'
  })

  useEffect(() => {
    if (incoming !== null) {
      setAdminCallState(prevState => ({
        ...prevState,
        modalIncomingShow: true
      }))
    } else if (incoming === null) {
      setAdminCallState(prevState => ({
        ...prevState,
        modalIncomingShow: false
      }))
    }
  }, [incoming])

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
  }, []); //NOTE []

  useEffect(() => {
    if (adminCallState.localAudioTrack !== null) {
      rtcClient.publish(adminCallState.localAudioTrack);
    }
  }, [adminCallState.localAudioTrack]); //NOTE adminCallState.localAudioTrack

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
        alert('Line 98');
        clearInterval(adminCallState.interval);
        setAdminCallState(prevState => ({
          ...prevState,
          interval: null
        }));
      }
    }
  }, [adminCallState.mediaRecorder]); //NOTE adminCallState.mediaRecorder

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
          setIncoming(null);
        }
      }
    }
  }, [adminCallState.modalIncallShow]) //NOTE adminCallState.modalIncallShow

  let initRtc = async (channel) => {
    await rtcClient.join(config.appId, channel, config.token, user.user_id);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setAdminCallState(prevState => ({
      ...prevState,
      modalIncallShow: true,
      modalIncomingShow: false,
      localAudioTrack: localAudioTrack,
      audioInputType: 'mic'
    }))
  }

  const handleInitateCall = async () => {
    try {
      if (contactNumber === '') {
        alert('Input A Number');
        return;
      }

      const result = await axios.post('http://localhost:4000/api/communication', {
        mode: 'initiate',
        receiver_id: contactNumber,
      }, {
        headers: {
          'Authorization': user.auth,
          'Content-Type': 'application/json'
        }
      });
      const room_id = result.data.room_id;
      await initRtc(room_id);
    } catch (error) {
      alert(error.response.data.error);
    }
  }

  const acceptCall = async (audioType) => {
    try {
      await axios.post('http://localhost:4000/api/communication', {
        mode: 'receive',
        room_id: incoming.room_id,
        receiver_action: 'accept'
      }, {
        headers: {
          'Authorization': user.auth,
          'Content-Type': 'application/json'
        }
      });

      if (audioType === 'mic') {
        initRtc(incoming.room_id);
      } else if (audioType === 'file') {
        handleAnswerWithAudioFile(incoming.room_id)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const declineCall = async () => {
    try{
      await axios.post('http://localhost:4000/api/communication', {
        mode: 'receive',
        room_id: incoming.room_id,
        receiver_action: 'decline'
      }, {
        headers: {
          'Authorization': user.auth,
          'Content-Type': 'application/json'
        }
      });

      setIncoming(null);
    } catch(error) {
      console.log(error);
    }
  }

  const handleReceiveCall = async (receiver_action, audioType) => {
    switch (receiver_action) {
      case 'accept':
        await acceptCall(audioType);
        break;
      case 'decline':
        await declineCall();
        break;
      default:
        break;
    }
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

  const handleAnswerWithAudioFile = async (channel) => {
    await rtcClient.join(config.appId, channel, config.token, user.user_id);

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
      setIncoming(null);
    } catch(error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    webSocket.close();
    setUser(null);
  };

  return (
      <div 
          class="row gy-3"
          style={{textAlign: 'center'}}
      >
        <AdminIncomingModal
          show={adminCallState.modalIncomingShow}
          status={adminCallState.callStatus}
          onHide={() => {
            setIncoming(null);
          }}
          incoming={incoming}
          handleReceiveCall={handleReceiveCall}
        />
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
                value={contactNumber}
                onChange={(e) => {setContactNumber(e.target.value)}}
                id="inputField" 
                class="form-control mb-3" 
                style={{textAlign: 'center', borderColor: 'violet', borderWidth: '4px', borderStyle: 'solid', borderRadius: '30px'}} 
                placeholder="Enter A Contact Number"
            />
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center">
            <button 
                type="button" 
                class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="call-button"
                onClick={handleInitateCall}
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