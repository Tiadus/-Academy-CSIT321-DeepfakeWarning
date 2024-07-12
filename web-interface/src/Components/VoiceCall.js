import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const VoiceCall = ({clientID, webSocket, setWebSocket, appid}) => {
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
          console.log('Rem');
          mediaRecorder.stop();
        }

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }

        audioTracks.localAudioTrack.stop();
        audioTracks.localAudioTrack.close();
        rtcClient.unpublish();
        rtcClient.leave();
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
    await rtcClient.join(appid, 'main', null, clientID);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setAudioTracks(prevState => ({
      ...prevState,
      localAudioTrack: localAudioTrack
    }));
  }

  let leaveRoom = async () => {
    setIsRecording(false);
  }

  const handleInputSwitchToAudioFile = async () => {
    const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
      source: '/audiofiles/real.m4a'
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

  const handleAnswerWithAudioFile = async () => {
    await rtcClient.join(appid, 'main', null, clientID);

    const fileAudioTrack = await AgoraRTC.createBufferSourceAudioTrack({
      source: '/audiofiles/nier.mp3'
    });

    fileAudioTrack.startProcessAudioBuffer();

    setAudioTracks(prevState => ({
      ...prevState,
      localAudioTrack: fileAudioTrack
    }));
  }

  const handleLogout = () => {
    webSocket.close();
    setWebSocket(null);
  };

  return (
    <div>
        <div>
            <button onClick={initRtc} disabled={isRecording}>Initial Call</button>
        </div>
        <div>
            <button onClick={leaveRoom} disabled={!isRecording}>Hangup Call</button>
        </div>
        <br/>
        <div>
          <button onClick={handleInputSwitchToAudioFile} disabled={!isRecording || audioInputType === 'file'}>Switch Input To Audio File</button>
        </div>
        <div>
          <button onClick={handleInputSwitchToMicrophone} disabled={!isRecording || audioInputType === 'mic'}>Switch Input To Microphone</button>
        </div>
        <br/>
        <div>
          <button onClick={handleAnswerWithAudioFile} disabled={isRecording}>Answer Call With Audio File</button>
        </div>
        <br/>
        <div>
            <button onClick={handleLogout} disabled={isRecording}>Logout</button>
        </div>
    </div>
  );
};

export default VoiceCall;