import React, { useEffect, useState } from "react";
import {View, Text, Button} from 'react-native';
import { Link, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";

export default function Signin() {
  const {config, user, setUser, setWebSocket} = useGlobalContext();

  useEffect(() => {
    if (user !== null) {
      try {
        const socket = new WebSocket(config.server_main_ws);
  
        socket.onopen = () => {
          console.log('WebSocket connection opened');
          router.replace('/home');
          socket.send(user.clientID);
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
    setUser({
      clientID: '2'
    })
  }

  return (
      <View
      style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
      }}
      >
          <Text>Signin Screen</Text>
          <Button title='Signin' onPress={handleLogin}/>
          <Link
            href="/sign-up"
          >
            Signup
          </Link>
      </View>
  )
}