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
  
  /**
   * useEffect to manage audio recording based on the `isRecording` state.
   * 
   * This effect controls the start and stop of audio recording, as well as 
   * managing the media recorder and stream resources.
   * 
   * - When `isRecording` is `true`:
   *   - A setInterval is established to stop and start the media recorder 
   *     every 5 seconds, ensuring continuous recording.
   * 
   * - When `isRecording` is `false`:
   *   - The interval is cleared, and the media recorder is stopped.
   *   - All audio tracks are stopped and closed, and the stream is also 
   *     terminated.
   *   - The RTC client leaves the call, and a message is sent to the 
   *     React Native WebView indicating that the call has ended.
   * 
   * Dependencies: [isRecording] - The effect runs whenever the value of 
   * `isRecording` changes.
   */
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
  
  /**
   * Function to record an audio stream using the MediaRecorder API.
   *
   * This function initializes a MediaRecorder instance with the provided 
   * audio track and sets up event handlers for data availability and stop events.
   *
   * - When data is available, it checks if the WebSocket connection is open
   *   and sends the recorded audio data through the WebSocket.
   * 
   * - On stopping the recording, any placeholder functionality can be added.
   * 
   * After starting the media recorder, it updates the state to indicate 
   * that recording is in progress.
   * 
   * @param {MediaStreamTrack} audioTrack - The audio track to be recorded.
   */
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
  
  /**
   * useEffect to manage the initialization of the RTC client and handle user events.
   * 
   * This effect is executed once when the component mounts, creating an AgoraRTC client 
   * for real-time communication and setting up event listeners for user interactions.
   * 
   * - On user joined: Placeholder function for handling when a user joins the channel.
   * 
   * - On user published: Subscribes to the user's media streams. If the media type is 
   *   audio, it updates the state to include the remote audio track and plays the track.
   *   It also sets the call status to 'Incall' and starts recording the audio stream.
   * 
   * - On user left: Deletes the user's audio track from the state and stops recording.
   * 
   * Dependencies: None - This effect runs only once on component mount.
   */
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
  
  /**
   * useEffect to publish the local audio track to the RTC client.
   * 
   * This effect monitors the `audioTracks.localAudioTrack` state and publishes 
   * the local audio track to the RTC client when it is not null.
   * 
   * Dependencies: [audioTracks.localAudioTrack] - The effect runs whenever 
   * the local audio track changes.
   */
  useEffect(() => {
    if (audioTracks.localAudioTrack !== null) {
      rtcClient.publish(audioTracks.localAudioTrack);
    }
  }, [audioTracks.localAudioTrack]);

  /**
   * Initializes the RTC client for a specified room.
   * 
   * This function attempts to join an RTC channel using the AgoraRTC client.
   * 
   * - It takes a `room_id` parameter to identify the channel to join.
   * - On successful join, it sets the call status and marks the call as active.
   * - If an error occurs during the join process, it alerts the user.
   * 
   * Parameters:
   * - room_id (string): The ID of the room to join.
   */
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

  /**
   * Handles the initiation of a call.
   * 
   * This asynchronous function sends a request to the server to initiate a call 
   * with a specified receiver. Upon successful initiation, it retrieves the 
   * room ID and initializes the RTC client for that room.
   * 
   * - It checks for errors in the request and alerts the user if any occur.
   * 
   * Dependencies:
   * - callProcess.contact.user_id: The ID of the user being called.
   * - callProcess.user.auth: The authorization token for the user initiating the call.
   */
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

  /**
   * Handles the acceptance of an incoming call.
   * 
   * This asynchronous function sends a request to the server to accept an 
   * incoming call and join the corresponding room. Upon successful acceptance,
   * it initializes the RTC client for that room.
   * 
   * - It retrieves the room ID from the call process state.
   * - It handles errors in the request by logging them to the console.
   * 
   * Dependencies:
   * - callProcess.contact.room_id: The ID of the room being joined.
   * - callProcess.user.auth: The authorization token for the user accepting the call.
   */
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

  /**
   * Manages the call process based on the call mode.
   * 
   * This asynchronous function determines whether the call is outgoing or 
   * incoming and executes the corresponding function to handle the call:
   * - If the call is outgoing, it calls `handleInitateCall()` to initiate the call.
   * - If the call is incoming, it calls `handleAcceptCall()` to accept the call.
   * 
   * Errors encountered during the process are caught and displayed as alerts.
   * 
   * Dependencies:
   * - callProcess.mode: Determines the type of call being processed ('outgoing' or 'incoming').
   */
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

  /**
   * Handles the process of declining an incoming call.
   * 
   * This asynchronous function sends a decline action to the server using an HTTP POST request.
   * It includes the room ID and user authentication in the request headers. 
   * If the request is successful, it checks if `window.ReactNativeWebView` is available 
   * and sends a message to end the call on the client-side.
   * 
   * Errors encountered during the process are caught and displayed as alerts.
   * 
   * Dependencies:
   * - callProcess.contact.room_id: The ID of the room associated with the call.
   * - callProcess.user.auth: The user's authentication token for the request.
   */
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

  /**
   * Handles the end call process.
   * 
   * This function checks the recording state:
   * - If recording is active (`isRecording === true`), it stops the recording by setting `isRecording` to false.
   * - If recording is inactive (`isRecording === false`), it checks for the presence of `window.ReactNativeWebView`.
   *   If available, it sends a message to the WebView to indicate the end of the call.
   * 
   * Dependencies:
   * - isRecording: A boolean that indicates whether the call is currently being recorded.
   */
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