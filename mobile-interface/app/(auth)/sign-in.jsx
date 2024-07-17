import React, { useEffect, useState } from "react";
import {View, Text, Button} from 'react-native';
import { Link, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";

export default function Signin() {
  const {user, setUser} = useGlobalContext();
  const {webSocket, setWebSocket} = useGlobalContext();

  useEffect(() => {
    if (user !== null) {
      const socket = new WebSocket('ws://localhost:4000');
  
      socket.onopen = () => {
        console.log('WebSocket connection opened');
        socket.send(user.clientID);
      };
      
      socket.onmessage = (event) => {
        console.log('Received message:', event.data);
        setMessage(event.data);
      };
      
      socket.onerror = (error) => {
        console.log('WebSocket error:', error);
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };

      setWebSocket(socket)
    }
  }, [user]);

  useEffect(() => {
    if (webSocket !== null) {
      router.replace('/home');
    }
  }, [webSocket]);
  
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