import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const VoiceCall = ({clientID, webSocket, setWebSocket, appid}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [intervalID, setIntervalID] = useState(null);

  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: []
  });

  const [rtcClient, setRtcClient] = useState(null);

  /*let audioTracks = {
    localAudioTrack: null,
    remoteAudioTracks: {}
  }

  //let rtcClient;

  const handleUserJoined = async (user) => {
    console.log('A New User Has Joined');
    console.log(user)
  }

  const handleUserPublished = async (user, mediaType) => {
    console.log(rtcClient);
    await rtcClient.subscribe(user, mediaType);

    if (mediaType === 'audio') {
      audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      user.audioTrack.play();
    }
  }*/

  useEffect(() => {
    const startRecording = () => {
      if (intervalID === null) {
        if (isRecording === true) {
          setIntervalID(setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
          },5000))
        }
      }
    }
    startRecording();
  }, [mediaRecorder])

  const recordAudioStream = (audioTrack) => {
    const mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]));

    let chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(e.data);
      }
    };
  
    mediaRecorder.onstop = () => {
      //const audioBlob = new Blob(chunks, { type: 'audio/wav' });
    };
  
    mediaRecorder.start();
  
    setIsRecording(true);
    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (rtcClient === null) {
      const rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'});

      const handleUserJoined = async (user) => {
        console.log('A New User Has Joined');
        console.log(user)
      }
    
      const handleUserPublished = async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);
    
        if (mediaType === 'audio') {
          audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];

          user.audioTrack.play();
          recordAudioStream(user.audioTrack.mediaStreamTrack);
        }
      }

      let handleUserLeft = async (user) => {
        delete audioTracks.remoteAudioTracks[user.uid]
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
    /*rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
  
    rtcClient.on('user-joined', handleUserJoined);
    rtcClient.on('user-published', handleUserPublished);*/

    await rtcClient.join(appid, 'main', null, clientID);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setAudioTracks(prevState => ({
      ...prevState,
      localAudioTrack: localAudioTrack
    }));

    //audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //await rtcClient.publish(audioTracks.localAudioTrack);
  }

  let leaveRoom = async () => {
    audioTracks.localAudioTrack.stop();
    audioTracks.localAudioTrack.close();
    rtcClient.unpublish();
    rtcClient.leave();

    if (intervalID !== null) {
      clearInterval(intervalID);
      setIntervalID(null);
    }

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }

    setIsRecording(false);
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
        <div>
            <button onClick={handleLogout} disabled={isRecording}>Logout</button>
        </div>
    </div>
  );
};

export default VoiceCall;