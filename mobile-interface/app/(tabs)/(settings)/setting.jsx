import React, { useEffect } from "react";
import {View, SafeAreaView, Text, Image, TouchableOpacity} from 'react-native'
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalContext } from "../../../context/GlobalStatus"

export default function Setting() {
    const {user, setUser, setIncoming, setCallProcess} = useGlobalContext();
    const {webSocket, setWebSocket} = useGlobalContext();

    //Reset the user once disconnected
    useEffect(() => {
        if (user === null) {
            setWebSocket(null);
        }
    }, [user]);

    useEffect(() => {
    if (webSocket === null) {
        //router.navigate('/');
    }
    }, [webSocket]);

    //Handle logout process
    const handleLogout = async () => {
        if (webSocket) {
            webSocket.close();
        }
        setUser(null);
        setIncoming({});
        setCallProcess({});
        router.replace('/');
    }

    return (
      <SafeAreaView className='items-center h-full bg-background-primary'>
        <View className='h-full w-11/12 bg-background-primary'>
          <View className='flex-col mt-20 mb-10'>
            <Text className='font-extrabold text-4xl text-text-primary'>SETTINGS</Text>
          </View>
          <View className='flex-row w-full overflow-hidden border-b-2 border-text-primary pb-8 mb-8'>
            <View className='border-2 border-app-primary rounded-xl'>
              <Image
                source={{uri: ('http://localhost:4000/' + user.avatar)}}
                className="w-[100px] h-[100px] overflow-hidden rounded-xl"
              />
            </View>
            <View className='flex-1 p-3 items-center justify-center'>
              <View className='flex-col w-full gap-y-3'>
                <Text numberOfLines={1} className='text-3xl font-bold text-text-primary'>{user.user_name}</Text>
                <Text numberOfLines={1} className='text-xl text-text-primary'>Salos: {user.user_id}</Text>
              </View>
            </View>
          </View>
          <View className='w-full gap-y-8 border-b-2 border-text-primary pb-8 mb-8'>
            <TouchableOpacity onPress={() => {router.push('/edit_profile')}} className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#032784]'>
                <Ionicons name='person' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>Edit Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#8D8F00]'>
                <Ionicons name='notifications' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>Notifications</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#810000]'>
                <Ionicons name='power' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className='w-full gap-y-8'>
            <TouchableOpacity className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#44009A]'>
                <Ionicons name='information-circle' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>About Us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#00698A]'>
                <Ionicons name='mail' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>Contact Us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row'>
              <View className='items-center justify-center w-[50px] h-[45px] rounded-lg bg-[#006D04]'>
                <Ionicons name='receipt' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
              </View>
              <View className='flex-1 justify-center pl-6'>
                <Text className='text-2xl text-text-primary'>Term of Services</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
}