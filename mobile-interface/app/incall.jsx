import { Text, View, SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import React, { useEffect, useState, useRef} from "react";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalStatus";

export default function Incall() {

  const {user} = useGlobalContext();
  const [viewLoaded, setViewLoaded] = useState(false);
  const webViewRef = useRef(null);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
    // Handle the error, e.g., show an alert or retry logic
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('HTTP error: ', nativeEvent);
    // Handle the HTTP error, e.g., show an alert or retry logic
  };

  useEffect(() => {
    if (viewLoaded === true) {
      const message = `${user.clientID}`
      webViewRef.current.postMessage(message);
    }
  }, [viewLoaded])

  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === "End Call") {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{uri: 'http://192.168.56.1:3000/client'}}
        onLoad={()=>{
          setViewLoaded(true)
        }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        onMessage={onMessage}
        onError={handleWebViewError}
        onHttpError={handleHttpError}
      />
    </SafeAreaView>
  );
};