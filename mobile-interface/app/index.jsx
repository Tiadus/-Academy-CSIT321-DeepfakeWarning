import { Image, View, Animated, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState, useRef} from "react";
import { useGlobalContext } from "../context/GlobalStatus";

// Import components for obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';

import { images } from "../constants";

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <FadeInView>
        <Image
          source={images.logo}
          className="w-[300px] h-[300px] mb-12"
        />
      </FadeInView>
      <TouchableOpacity
        className="bg-blue-950 rounded-3xl w-10/12 items-center justify-center h-12 mb-5"
        onPress={() => router.navigate('/sign-in')}
      >
        <Text className="text-white">SignIn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded-3xl w-10/12 items-center justify-center h-12"
        style={{backgroundColor: '#6E0E59'}}
        onPress={() => router.navigate('/sign-up')}
      >
        <Text className="text-white">Register</Text>
      </TouchableOpacity>
    </View>
  );
}