import React, { useEffect, useState } from "react";
import {View, Button, ScrollView} from 'react-native'
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { SettingsButton } from "../../components/SettingButton";

export default function Setting() {
    const {user, setUser} = useGlobalContext();
    const {webSocket, setWebSocket} = useGlobalContext();

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

    const handleLogout = async () => {
        if (webSocket) {
            webSocket.close();
        }
        setUser(null);
        router.replace('/');
    }

    return (
        <View className="w-full flex p-4 pt-8 gap-6 mt-4">
          <Text className="text-4xl font-bold">Settings</Text>
          <View className="bg-[#D9D9D9] flex-row w-full p-2 rounded-3xl gap-x-2 ">
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={48}
              color="gray"
              className="basis-1/5"
            />
            <View className="flex  basis-3/5 mr-4">
              <Text className="text-2xl font-semibold">{user.user_name}</Text>
              <Text className="text-slate-500">Status</Text>
            </View>
            <FontAwesome name="qrcode" size={48} color="black"  className=" basis-1/5"/>
          </View>
  
          <View className="bg-[#D9D9D9] w-full rounded-3xl p-1 overflow-hidden">
            <SettingsButton icon={'person-outline'} borderOption={'border-b border-slate-400'} buttonName={'Edit Profile'} handleClick={() => {console.log('Profile')}}/>
            <SettingsButton icon={'notifications-outline'} borderOption={'border-b border-slate-400'} buttonName={'Accessibility Features'} handleClick={() => {return;}}/>
            <SettingsButton icon={'volume-medium-outline'} borderOption={'border-b border-slate-400'} buttonName={'Delete Account'} handleClick={() => {return;}}/>
            <SettingsButton icon={'trash-outline'} borderOption={'border-b border-slate-400'} buttonName={'Delete Account'} handleClick={() => {return;}}/>
            <SettingsButton icon={'power-outline'} borderOption={''} buttonName={'Log Out'} handleClick={() => {handleLogout()}}/>
          </View>

          <View className="bg-[#D9D9D9] w-full rounded-3xl p-1 overflow-hidden">
            <SettingsButton icon={'mail-outline'} borderOption={'border-b border-slate-400'} buttonName={'Contact Us'} handleClick={() => {return;}}/>
            <SettingsButton icon={'alert-circle-outline'} borderOption={'border-b border-slate-400'} buttonName={'About Us'} handleClick={() => {return;}}/>
            <SettingsButton icon={'help-outline'} borderOption={'border-b border-slate-400'} buttonName={'Help Center'} handleClick={() => {return;}}/>
            <SettingsButton icon={'document-text-outline'} borderOption={'border-b border-slate-400'} buttonName={'Terms of Service'} handleClick={() => {return;}}/>
            <SettingsButton icon={'document-lock-outline'} borderOption={''} buttonName={'Privacy Policy'} handleClick={() => {return;}}/>
          </View>
        </View>
    )
}