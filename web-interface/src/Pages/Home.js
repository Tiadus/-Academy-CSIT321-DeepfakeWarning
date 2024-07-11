import { useState, useEffect } from 'react';
import VoiceCall from '../Components/VoiceCall';

const Home = ({clientID, webSocket, setWebSocket, appid}) => {
  return (
    <div>
      <VoiceCall clientID={clientID} webSocket={webSocket} setWebSocket={setWebSocket} appid={appid}/>
    </div>
  );
};

export default Home;