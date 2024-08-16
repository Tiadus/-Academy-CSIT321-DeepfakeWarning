import { Image, View, Animated, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {LinearGradient} from 'expo-linear-gradient';

// Import components for obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';

import { images } from "../constants";

const FadeInRotateView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
        transform: [{ rotate: rotateInterpolation }]
      }}>
      {props.children}
    </Animated.View>
  );
};

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-y-20 bg-background-primary">
      <View classname="relative w-[350px] h-[350px] bg-app-primary">
        <FadeInRotateView classname="relative">
          <LinearGradient
              className='items-center justify-center w-[350px] h-[350px] rounded-full p-2'
              start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
              colors={['#0B5DFB', '#99008A']}
          >
          </LinearGradient>
        </FadeInRotateView>
        <Animated.View 
          className='items-center justify-center w-[350px] h-[350px] rounded-full absolute'
          style={{opacity: fadeAnim}}
        >
          <View className='w-[320px] h-[320px] rounded-full'>
            <Image
              source={images.logo}
              className="w-full h-full"
            />
          </View>
        </Animated.View>
      </View>
      <View className="flex-col items-center justify-center w-10/12 h-12 gap-y-5">
        <TouchableOpacity
          className="items-center justify-center w-full h-full rounded-3xl bg-button-primary"
          onPress={() => router.navigate('/sign-in')}
        >
          <Text className="text-text-primary">SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-full h-full rounded-3xl bg-button-secondary"
          onPress={() => router.navigate('/sign-up')}
        >
          <Text className="text-text-primary">Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}