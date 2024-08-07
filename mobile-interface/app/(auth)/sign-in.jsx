import { useEffect, useState } from "react";
import {View, Text, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import { Link, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";
import { images } from "../../constants";
import axios from 'axios';

export default function Signin() {
  const {config, user, setUser, setWebSocket} = useGlobalContext();
  const [userEmail, onChangeUserEmail] = useState('');
  const [userPassword, onChangeUserPassword] = useState('');

  useEffect(() => {
    if (user !== null) {
      try {
        const socket = new WebSocket(config.server_main_ws);
  
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
    <View className="items-center bg-white h-full">
      <Image
        source={images.logo}
        className="w-[110px] h-[110px] mb-10 mt-20"
      />
      <Text className="font-bold text-5xl mb-10">SIGN IN</Text>
      <View className="w-10/12">
        <Text className="font-bold text-lg self-start mb-2">Email/Phone Number</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Enter Your Email/Phone Number"
          onChangeText={(value) => onChangeUserEmail(value)}
        />
      </View>
      <View className="w-10/12">
        <Text className="font-bold text-lg self-start mb-2">Password</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Enter Your Password"
          onChangeText={(value) => onChangeUserPassword(value)}
          secureTextEntry={true}
        />
        <Text className="self-end underline mb-8">Forgot Password?</Text>
      </View>
      <TouchableOpacity
        className="rounded-xl w-10/12 items-center justify-center h-12 mb-8"
        style={{backgroundColor: '#343434'}}
        onPress={handleLogin}
      >
        <Text className="text-white">SIGN IN</Text>
      </TouchableOpacity>
      <Text className="text-lg">Don't have an account?</Text>
      <Link
        className="font-bold text-lg underline"
        href="/sign-up"
      >
        Register
      </Link>
    </View>
  )
}