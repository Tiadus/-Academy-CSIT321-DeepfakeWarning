import axios from 'axios';
import { BsDoorOpen } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { GiRadioactive } from "react-icons/gi";
import { SlMicrophone } from "react-icons/sl";
import { ImPhoneHangUp } from "react-icons/im";
import { BsMicMute } from "react-icons/bs";
import { FaBluetoothB } from "react-icons/fa";
import { MdPhonePaused } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { IoVolumeLowSharp } from "react-icons/io5";
import { useState, useEffect} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
const config = require('../app-config');

const ClientCall = ({callProcess, webSocket, callStatus, setCallStatus}) => {
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
        
        //rtcClient.unpublish();
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

  let initRtc = async (room_id) => {
    try {
      await rtcClient.join(config.appId, room_id, config.token, callProcess.user.user_id);

      //Option To Get The Client Microphone When Communicating Through HTTPS
      /*const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setAudioTracks(prevState => ({
        ...prevState,
        localAudioTrack: stream
      }));*/

      setCallStatus('s');
      setIncall(true);
    } catch(error) {
      alert(error);
      alert('Error In Joining!');
    }
  }

  const handleInitateCall = async () => {
    try {
      const result = await axios.post('http://localhost:4000/api/communication', {
        mode: 'initiate',
        receiver_id: callProcess.contact.user_id,
      }, {
        headers: {
          'Authorization': callProcess.user.auth,
          'Content-Type': 'application/json'
        }
      });
      const room_id = result.data.room_id;
      await initRtc(room_id);
    } catch (error) {
      alert(error.response.data.error);
    }
  }

  const handleAcceptCall = async () => {
    try {
      await axios.post('http://localhost:4000/api/communication', {
        mode: 'receive',
        room_id: callProcess.contact.room_id,
        receiver_action: 'accept'
      }, {
        headers: {
          'Authorization': callProcess.user.auth,
          'Content-Type': 'application/json'
        }
      });

      initRtc(callProcess.contact.room_id);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCallProcess = async () => {
    try {
      if (callProcess.mode === "outgoing") {
        await handleInitateCall();
      } else if (callProcess.mode === "incoming") {
        await handleAcceptCall();
      }
    } catch (error) {
      alert(error);
    }
  }

  const handleDeclineCall = async () => {
    try{
      await axios.post('http://localhost:4000/api/communication', {
        mode: 'receive',
        room_id: callProcess.contact.room_id,
        receiver_action: 'decline'
      }, {
        headers: {
          'Authorization': callProcess.user.auth,
          'Content-Type': 'application/json'
        }
      });
      if(window.ReactNativeWebView) { // ensure window.ReactNativeWebView is there, otherwise, web app might crash if is not there
        window.ReactNativeWebView.postMessage('End Call');
      }
    } catch(error) {
      alert(error);
    }
  }
 
  const handleEndCall = () => {
      if (isRecording === true) {
          setIsRecording(false);
      } else if (isRecording === false) {
          if(window.ReactNativeWebView) { //Ensure window.ReactNativeWebView is there to prevent crashing
              window.ReactNativeWebView.postMessage('End Call');
          }
      }
  };

  const handleCallTermination = async () => {
    try {
      if (incall === false ) {
        if (callProcess.mode === "outgoing") {
          if(window.ReactNativeWebView) { //Ensure window.ReactNativeWebView is there to prevent crashing
            window.ReactNativeWebView.postMessage('End Call');
          }
        } else if (callProcess.mode === "incoming") {
          handleDeclineCall();
        }
      } else if (incall === true) {
        handleEndCall();
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div class='w-full h-full'>
      <div class='flex flex-col w-full h-full'>
          <div class='w-full h-2/3 pt-28'>
            <div class='w-full h-full'>
              <div class='flex flex-row items-center justify-center gap-x-2 mb-24'>
                <span>
                  {callStatus === "s" && <IoShieldCheckmark size={35} color="green"/>}
                  {callStatus === "d" && <GiRadioactive size={35} color="red"/>}
                </span>
                <span class='text-3xl text-[#F1F1F1]'>
                  {callStatus === "e" ? (callProcess.mode === "outgoing" ? "Now Calling..." : "Incoming...") : (callStatus === "s" ? "Call Safe" : "Deepfake Detected")}
                </span>
              </div>
              <div class="flex items-center justify-center w-full mb-24">
                    <img class="w-[200px] h-[200px] border-2 rounded-full overflow-hidden border-blue-500" src={'http://localhost:4000/' + callProcess.contact.avatar} alt='LOGO'/>
              </div>
              <div class='text-center text-3xl mb-6 text-[#F1F1F1]'>{callProcess.contact.user_name}</div>
            </div>
          </div>
          <div class='flex-1 w-full p-3'>
            {incall === false && 
              <div class='relative w-full h-full'>
                <div class='absolute bottom-0 flex items-center justify-center w-full h-2/3'>
                  <div class='flex flex-row w-full'>
                    <div class='flex flex-col items-center w-1/2'>
                      <span onClick={handleCallTermination} class='flex-col inline-block mb-2'>
                        <span class='inline-block rounded-full p-3 bg-red-500'>
                          {callProcess.mode === "outgoing" && <BsDoorOpen size={40} color="white"/>}
                          {callProcess.mode === "incoming" && <ImPhoneHangUp size={40} color="white"/>}
                        </span>
                      </span>
                      <span className="text-2xl font-bold text-[#F1F1F1]">
                        {callProcess.mode === "outgoing" ? "Exit" : "Decline"}
                      </span>
                    </div>
                    <div class='flex flex-col items-center w-1/2'>
                      <span onClick={handleCallProcess} class='flex-col inline-block mb-2'>
                        <span class='inline-block rounded-full p-3 bg-[#12E200]'>
                          <FaPhoneAlt size={40} color="white"/>
                        </span>
                      </span>
                      <span className="text-2xl font-bold text-[#F1F1F1]">
                      {callProcess.mode === "outgoing" ? "Call" : "Accept"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
            {incall === true && 
              <div class='w-full border-t-2 border-[#484848] pt-3'>
                <div class='flex flex-row mb-10'>
                  <div class='flex flex-col items-center w-1/3'>
                    <span class='flex-col inline-block mb-2'>
                      <span class='inline-block rounded-full p-1'>
                        <BsMicMute size={50} color="#908F9D"/>
                      </span>
                    </span>
                    <span className="text-xl font-bold text-[#908F9D]">
                      Mute
                    </span>
                  </div>
                  <div class='flex flex-col items-center w-1/3'>
                    <span class='flex-col inline-block mb-2'>
                      <span class='inline-block rounded-full p-1'>
                        <FaBluetoothB size={50} color="#908F9D"/>
                      </span>
                    </span>
                    <span className="text-xl font-bold text-[#908F9D]">
                      Bluetooth
                    </span>
                  </div>
                  <div class='flex flex-col items-center w-1/3'>
                    <span class='flex-col inline-block mb-2'>
                      <span class='inline-block rounded-full p-1'>
                        <MdPhonePaused size={50} color="#908F9D"/>
                      </span>
                    </span>
                    <span className="text-xl font-bold text-[#908F9D]">
                      Hold
                    </span>
                  </div>
                </div>
                <div class='flex flex-row'>
                  <div class='flex flex-col items-center justify-center w-1/3'>
                    <span class='flex-col inline-block mb-2'>
                      <span class='inline-block p-1'>
                        <BsGrid size={50} color="grey"/>
                      </span>
                    </span>
                  </div>
                  <div class='flex flex-col items-center justify-center w-1/3'>
                    <span onClick={handleCallTermination} class='flex-col inline-block mb-2'>
                      <span class='inline-block rounded-full p-3 bg-red-500'>
                        <ImPhoneHangUp size={40} color="white"/>
                      </span>
                    </span>
                  </div>
                  <div class='flex flex-col items-center justify-center w-1/3'>
                    <span class='flex-col inline-block mb-2'>
                      <span class='inline-block p-1'>
                        <IoVolumeLowSharp size={50} color="grey"/>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
      </div>
    </div>
  );
};

export default ClientCall;