import { Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "react-native";
import React, { useEffect, useState, useRef} from "react";
import { useGlobalContext } from "../context/GlobalStatus";

// Import components for obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';

// Import Agora SDK
import RtcEngine, {
  createAgoraRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';

export default function Index() {

  const {config, agoraEngine, setAgoraEngine} = useGlobalContext();

  const setupAgoraEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      }

      const agoraEngine = createAgoraRtcEngine();

      agoraEngine.initialize({
        appId: config.appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication
      });

      agoraEngine.registerEventHandler({
          onJoinChannelSuccess: () => {
              console.log('Successfully joined the channel：');
          },
          onUserJoined: (_connection, Uid) => {
              console.log('Remote user ' + Uid + ' joined');
          },
          onUserOffline: (_connection, Uid) => {
            console.log('Remote user ' + Uid + ' left the channel');
          },
          onError: (error) => {
            console.log('Error Connecting')
          },
          onConnectionLost: () => {
            console.log('Lost')
          },
          onLeaveChannel: () => {
            console.log('Leave');
          }
      });

      setAgoraEngine(agoraEngine)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (agoraEngine === null) {
      setupAgoraEngine();
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title='Enter' onPress={() => {
        if (agoraEngine !== null) {
          router.push('/sign-in')
        }
      }}/>
    </View>
  );
}
