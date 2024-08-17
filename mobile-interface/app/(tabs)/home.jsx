import { Image, ScrollView, Text, View, SafeAreaView } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Button, SegmentedButtons } from "react-native-paper";
import { CallInfo } from "@/components/ui/CallInfo";
import {LinearGradient} from 'expo-linear-gradient';

import { images } from "../../constants";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalContext } from "../../context/GlobalStatus";

import { useEffect } from 'react';

import axios from 'axios';

import CallHistory from '../../components/CallHistory'

export default function Home() {
  const isFocused = useIsFocused();
  const {user} = useGlobalContext();
  const [value, setValue] = useState("in");
  const [statistic, setStatistic] = useState({})

  useEffect(() => {
      if (isFocused == true) {
        try {
          retrieveStatistic();
        } catch (error) {
          console.log(error);
        }
      }
  }, [isFocused])

  const retrieveStatistic = async () => {
    try{
        const statisticRequest = await axios.get('http://localhost:4000/api/statistic', {
          headers: {
            'Authorization': user.auth,
            'Content-Type': 'application/json'
          }
        });
        setStatistic(statisticRequest.data.statistic);
        return;
      } catch(error) {
        console.log(error);
      }
  }

  return (
    <SafeAreaView className='items-center h-full bg-background-primary'>
      <View className='h-full w-11/12 bg-background-primary'>
        <View className='flex-col mt-20 mb-10'>
          <Text className='font-extrabold text-4xl text-text-primary'>DASHBOARD</Text>
          <Text className='font-bold text-2xl text-app-primary'>Welcome!</Text>
        </View>
        <View className='flex-row w-full mb-10'>
          <View className='w-1/2'>
            <View className='self-start flex-col gap-y-2 items-center'>
              <LinearGradient
                  className='items-center justify-center w-[175px] h-[175px] rounded-full p-2'
                  start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                  colors={['#8AE3FF', '#8AE3FF', '#8AE3FF', '#1A5AFF', '#1A5AFF', '#AEA7FF', '#AEA7FF', '#9C3AFF']}
              >
                <View className='items-center justify-center w-[150px] h-[150px] rounded-full bg-background-secondary'>
                  <View className='flex-1 items-center justify-center'>
                    <Text numberOfLines={1} className='font-bold text-[50px] text-app-primary'>
                      {statistic.incomingCallHistory ? statistic.incomingCallHistory.length + statistic.outgoingCallHistory.length : ''}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
              <Text className='font-bold text-2xl text-app-primary'>Calls</Text>
            </View>
          </View>
          <View className='w-1/2'>
            <View className='self-end flex-col gap-y-2 items-center'>
              <LinearGradient
                  className='items-center justify-center w-[175px] h-[175px] rounded-full p-2'
                  start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                  colors={['#BD8AFF', '#BD8AFF', '#BD8AFF', '#99008A', '#99008A', '#FFA7F1', '#FFA7F1', '#FF3ADF']}
              >
                <View className='items-center justify-center w-[150px] h-[150px] rounded-full bg-background-secondary'>
                  <View className='flex-1 items-center justify-center'>
                    <Text className='font-bold text-[50px] text-app-secondary'>
                      {statistic.deepfakeCallPercentage ? statistic.deepfakeCallPercentage : ''}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
              <Text className='font-bold text-2xl text-app-secondary'>Flagged</Text>
            </View>
          </View>
        </View>
        <View className='gap-y-4'>
          <Text className="text-2xl text-text-primary">CALL HISTORY</Text>
          <View className="self-center flex flex-row items-center justify-between w-1/2 rounded">
            <SegmentedButtons 
                className='rounded bg-background-primary'
                value={value}
                onValueChange={setValue}
                buttons={[
                    {
                      value: "in",
                      label: "Incoming",
                      style: {
                        backgroundColor: value === "in" ? "#181658" : "#0A083F", // Focus and Unfocus background
                        borderRadius: 12, // Customize the roundness
                        borderColor: "transparent",
                      },
                      labelStyle: {
                        color: value === "in" ? "#F1F1F1" : "#767676", // Focus and Unfocus text color
                      }
                    },
                    {
                      value: "out",
                      label: "Outgoing",
                      style: {
                        backgroundColor: value === "out" ? "#181658" : "#0A083F",
                        borderRadius: 12,
                        borderColor: "transparent",
                      },
                      labelStyle: {
                        color: value === "out" ? "#F1F1F1" : "#767676",
                      }
                    }
                ]}
            />
          </View>
          <View className= "w-full rounded-3xl h-1/2 overflow-hidden">
            {
              statistic.incomingCallHistory !== undefined && 
              <CallHistory histories={value === "in" ? statistic.incomingCallHistory : statistic.outgoingCallHistory}></CallHistory>
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}