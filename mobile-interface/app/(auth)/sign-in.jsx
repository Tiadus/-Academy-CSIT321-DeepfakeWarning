import { useEffect, useState } from "react";
import {View, Text, TouchableOpacity, Image, TextInput, Alert, SafeAreaView} from 'react-native';
import { Link, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";
import {LinearGradient} from 'expo-linear-gradient';
import { images } from "../../constants";
import axios from 'axios';

export default function Signin() {
  const {config, user, setUser, setWebSocket} = useGlobalContext();
  const [userEmail, onChangeUserEmail] = useState('');
  const [userPassword, onChangeUserPassword] = useState('');

  useEffect(() => {
    if (user !== null) {
      try {
        const socket = new WebSocket('ws://localhost:4000');
  
        socket.onopen = () => {
          console.log('WebSocket connection opened');
          router.replace('/home');
          socket.send(user.user_id);
        };
        
        socket.onmessage = (event) => {
          console.log('Received message:', event.data);
        };
        
        socket.onerror = (error) => {
          console.log('WebSocket error:', error);
        };
        
        socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
        };
  
        setWebSocket(socket)
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);
  
  const handleLogin = async () => {
    if (userEmail === '' || userPassword === '') {
      Alert.alert(
        'Warning',
        'Please Input All Credential',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      );
      return;
    }

    const encodedAuthentication = btoa(userEmail + ':' + userPassword);
    const auth = `Basic ${encodedAuthentication}`

    try{
      const loginResult = await axios.post('http://localhost:4000/api/login', {}, {
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        }
      });

      const user = loginResult.data;
      user.user_id = loginResult.data.user_id.toString();
      user.auth = auth;
      
      setUser(user);
    } catch(error) {
      if (error.response && error.response.status) {
        let errorStatus = error.response.status;
        let errorMessage = error.response.data.error;
        if (errorStatus === 401) {
          errorMessage = 'Invalid Credential'
        }
        Alert.alert(
          'Warning',
          errorMessage,
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        );
        return;
      } else {
        console.log(error);
      }
    }
  }

  return (
    <SafeAreaView className="flex flex-col items-center w-full h-full bg-background-primary">
        <View className="items-center w-full mt-20 mb-4">
          <LinearGradient
              className='items-center justify-center w-[110px] h-[110px] rounded-full p-2 mb-4'
              start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
              colors={['#0B5DFB', '#99008A']}
          >
            <View className='items-center justify-center w-[95px] h-[95px] rounded-full'>
              <Image
                source={images.logo}
                className="w-full h-full"
              />
            </View>
          </LinearGradient>
          <Text className="font-bold text-5xl text-text-primary">SIGN IN</Text>
        </View>
        <View className="w-10/12 gap-y-3 mb-4">
          <View className="w-full">
            <Text className="font-bold text-lg text-text-primary mb-2">Email/Phone Number</Text>
            <TextInput
              className="border-2 border-border-outline rounded-xl p-2 text-text-primary"
              placeholder="Enter Your Email/Phone Number"
              placeholderTextColor="#F1F1F1"
              onChangeText={(value) => onChangeUserEmail(value)}
            />
          </View>
          <View className="w-full">
            <Text className="font-bold text-lg text-text-primary mb-2">Password</Text>
            <TextInput
              className="border-2 border-border-outline rounded-xl p-2 text-text-primary"
              placeholder="Enter Your Password"
              placeholderTextColor="#F1F1F1"
              onChangeText={(value) => onChangeUserPassword(value)}
              secureTextEntry={true}
            />
            <Text className="self-end underline text-text-primary">Forgot Password?</Text>
          </View>
        </View>
        <View className="w-10/12 gap-y-2">
          <TouchableOpacity
            className="items-center justify-center w-full h-12 rounded-xl bg-button-primary"
            onPress={handleLogin}
          >
            <Text className="text-text-primary">SIGN IN</Text>
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-lg text-text-primary">Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                router.replace('sign-up')
              }}
            >
              <Text className="font-bold text-lg underline text-text-primary">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  )
}