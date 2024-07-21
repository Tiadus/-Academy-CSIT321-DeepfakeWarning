import { Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "react-native";
import React, { useEffect, useState, useRef} from "react";
import { useGlobalContext } from "../context/GlobalStatus";

// Import components for obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';

export default function Index() {

  const requirePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    requirePermission();
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
        router.push('/sign-in')
      }}/>
    </View>
  );
}