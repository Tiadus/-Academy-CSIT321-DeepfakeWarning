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

  /**
   * useEffect to manage the display of an incoming call modal.
   * 
   * This effect listens to changes in the `incoming` state and updates the `adminCallState`
   * to show or hide a modal for incoming calls based on whether `incoming` is `null` or not.
   * 
   * - If `incoming` is not `null`, the modal for the incoming call is shown.
   * - If `incoming` is `null`, the modal is hidden.
   * 
   * Dependency: [incoming] - The effect only runs when the value of `incoming` changes.
   */
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

  /**
   * useEffect to initialize the Agora RTC client and handle user events for a call.
   * 
   * This effect is executed only once on component mount, as indicated by the empty dependency array.
   * 
   * - If `rtcClient` is `null`, a new Agora RTC client is created.
   * - Event listeners are set up to handle user join, user publication, and user leave events.
   * 
   * Event Handlers:
   * 
   * - handleUserJoined: Updates the call status to 'Incall' when a user joins.
   * 
   * - handleUserPublished: 
   *   - Subscribes to the user's media track.
   *   - Plays the audio track if available.
   *   - Initializes a MediaRecorder to capture the audio and send it via WebSocket.
   *   - Updates the `adminCallState` to store the remote audio track and media recorder.
   * 
   * - handleUserLeft: 
   *   - Resets the remote audio track and hides the call modal when a user leaves.
   * 
   * The RTC client is set in the `rtcClient` state after initialization.
   */
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

  /**
   * useEffect to publish the local audio track to the Agora RTC client.
   * 
   * This effect listens for changes in `adminCallState.localAudioTrack`.
   * 
   * - If `localAudioTrack` is not `null`, it publishes the track to the RTC client,
   *   allowing other users to hear the local audio.
   * 
   * Dependency: [adminCallState.localAudioTrack] - The effect runs whenever the 
   * value of `localAudioTrack` changes.
   */
  useEffect(() => {
    if (adminCallState.localAudioTrack !== null) {
      rtcClient.publish(adminCallState.localAudioTrack);
    }
  }, [adminCallState.localAudioTrack]); //NOTE adminCallState.localAudioTrack

  /**
   * useEffect to manage the state and behavior of the media recorder.
   * 
   * This effect checks the state of `adminCallState.mediaRecorder` and manages
   * the recording of audio based on its status.
   * 
   * - If `mediaRecorder` is not `null` and its state is 'inactive', it starts the 
   *   media recorder and sets up an interval to stop and restart the recording every 5 seconds.
   * 
   * - If `mediaRecorder` is `null`, it clears the interval if it exists and resets 
   *   the interval state in `adminCallState`.
   * 
   * Dependency: [adminCallState.mediaRecorder] - The effect runs whenever the 
   * value of `mediaRecorder` changes.
   */
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

  /**
   * useEffect to handle cleanup when the incoming call modal is closed.
   * 
   * This effect checks the state of `adminCallState.modalIncallShow` and performs necessary
   * cleanup actions when the modal is hidden.
   * 
   * - If the modal is not shown (`modalIncallShow` is false), it checks if the `rtcClient`
   *   exists and performs the following:
   *   - Unpublishes local tracks and leaves the RTC channel if any local tracks are present.
   *   - Clears the recording interval if it exists.
   *   - Stops the media recorder if it is in the 'recording' state.
   *   - Stops and closes the local audio track, and resets various state properties in `adminCallState`.
   *   - Sets `incoming` to null, indicating no active incoming call.
   * 
   * Dependency: [adminCallState.modalIncallShow] - The effect runs whenever the 
   * value of `modalIncallShow` changes.
   */
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

  /**
   * Initializes the RTC client and joins a channel.
   * 
   * This function joins the specified channel using the RTC client, creates a local 
   * audio track from the microphone, and updates the admin call state to reflect 
   * the call status.
   * 
   * - Joins the channel using the provided app ID, channel name, token, and user ID.
   * - Creates a local audio track for capturing microphone input.
   * - Updates the `adminCallState` to:
   *   - Show the incoming call modal.
   *   - Hide the modal for incoming calls.
   *   - Set the local audio track for communication.
   *   - Set the audio input type to 'mic'.
   * 
   * @param {string} channel - The name of the channel to join.
   */
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

  /**
   * Handles the initiation of a call to a specified contact number.
   * 
   * This function checks if the contact number is provided, sends a POST request to 
   * the API to initiate the call, and initializes the RTC client with the returned room ID.
   * 
   * - Validates the input contact number; if empty, an alert is shown.
   * - Sends a POST request to the '/api/communication' endpoint with the mode set to 'initiate'
   *   and the receiver's ID.
   * - Sets the necessary headers for authorization and content type.
   * - Upon successful response, extracts the room ID from the response data and calls
   *   the `initRtc` function to join the room.
   * 
   * @throws {Error} If the API request fails, an alert is displayed with the error message.
   */
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

  /**
   * Accepts an incoming call based on the specified audio type.
   * 
   * This function sends a POST request to the API to accept the call and 
   * initializes the RTC client or handles audio file response based on the audio type.
   * 
   * - Sends a POST request to the '/api/communication' endpoint with the mode set to 'receive',
   *   the room ID from the incoming call, and the action set to 'accept'.
   * - Sets the necessary headers for authorization and content type.
   * - If the audio type is 'mic', it initializes the RTC connection with the incoming room ID.
   * - If the audio type is 'file', it calls the `handleAnswerWithAudioFile` function to process
   *   the audio file response.
   * 
   * @param {string} audioType - The type of audio input, either 'mic' or 'file'.
   * @throws {Error} If the API request fails, the error is logged to the console.
   */
  const acceptCall = async (audioType, fileType) => {
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
        handleAnswerWithAudioFile(incoming.room_id, fileType)
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Declines an incoming call.
   * 
   * This function sends a POST request to the API to decline the incoming call.
   * 
   * - Sends a POST request to the '/api/communication' endpoint with the mode set to 'receive',
   *   the room ID from the incoming call, and the action set to 'decline'.
   * - Sets the necessary headers for authorization and content type.
   * - Resets the `incoming` state to `null` upon successful decline of the call.
   * 
   * @throws {Error} If the API request fails, the error is logged to the console.
   */
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

  /**
   * Handles the reception of a call by performing the appropriate action based on the receiver action.
   * 
   * This function processes incoming call actions such as accepting or declining a call.
   * 
   * - Accepts the call by calling `acceptCall` with the specified audio type.
   * - Declines the call by calling `declineCall`.
   * - Handles unsupported actions by doing nothing.
   * 
   * @param {string} receiver_action - The action to take upon receiving the call (e.g., 'accept' or 'decline').
   * @param {string} audioType - The type of audio input for the call (e.g., 'mic' or 'file').
   */
  const handleReceiveCall = async (receiver_action, audioType, fileType) => {
    switch (receiver_action) {
      case 'accept':
        await acceptCall(audioType, fileType);
        break;
      case 'decline':
        await declineCall();
        break;
      default:
        break;
    }
  }

  /**
   * Handles switching the audio input source to a microphone.
   * 
   * This function stops the current audio track processing and closes the existing track,
   * then creates a new microphone audio track and updates the state to reflect the change
   * in audio input type to 'mic'.
   */
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

  /**
   * Handles switching the audio input source to an audio file.
   * 
   * This function creates a new audio track from a specified audio file, starts processing 
   * the audio buffer, stops and closes the current audio track, and updates the state 
   * to reflect the change in audio input type to 'file'.
   */
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

  /**
   * Handles answering a call with an audio file.
   * 
   * This function joins the RTC client to a specified channel, creates a new audio track
   * from a provided audio file, starts processing the audio buffer, and updates the state 
   * to reflect the audio input type as 'file', sets the call status to 'Incall', and 
   * displays the incoming call modal.
   *
   * @param {string} channel - The channel to join for the call.
   */
  const handleAnswerWithAudioFile = async (channel, fileType) => {
    await rtcClient.join(config.appId, channel, config.token, user.user_id);

    let fileAudioTrack = null;

    if (fileType === 'real') {
      fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
        source: '/audiofiles/sample.flac'
      });
    } else if (fileType === 'deepfake') {
      fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
        source: '/audiofiles/fake_sample.mp3'
      });
    }

    fileAudioTrack.startProcessAudioBuffer();

    setAdminCallState(prevState => ({
      ...prevState,
      localAudioTrack: fileAudioTrack,
      audioInputType: 'file',
      callStatus: 'Incall',
      modalIncallShow: true
    }))
  }

  /**
   * Ends the current call.
   * 
   * This function updates the call state to hide the incoming call modal,
   * resets the call status to 'Ringing', and clears the incoming call information.
   * 
   * @returns {Promise<void>} - A promise that resolves when the call has been ended.
   */
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

  /**
   * Handles user logout by closing the WebSocket connection 
   * and clearing the user state.
   * 
   * This function ensures that any ongoing communication 
   * is terminated properly before logging the user out.
   */
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