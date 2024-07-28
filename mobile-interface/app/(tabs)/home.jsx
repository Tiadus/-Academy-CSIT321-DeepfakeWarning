import { Image, ScrollView, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Button, SegmentedButtons } from "react-native-paper";
import { CallInfo } from "@/components/ui/CallInfo";

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
  const [statistic, setStatistic] = useState({incomingCallHistory: [{user_id: '1'}], outgoingCallHistory: [{user_id: '1'}]})

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
    <View className='bg-white h-full'>
      <View className="flex p-4 gap-4 mt-8">
        <View className=" flex-row py-4">
          <View className="justify-center overflow-hidden w-9/12">
            <Text className="text-4xl font-bold mb-2">Dashboard</Text>
            <Text numberOfLines={1}>HELLO {user.user_name}!</Text>
          </View>
          <View className="items-center justify-center self-end flex-1">
              <Image source={images.logo} className="w-[80px] h-[80px] self-end"/>
          </View>
        </View>
        <View className="bg-[#D9D9D9] p-4 rounded-3xl">
          <View className="flex-row justify-between items-center ">
            <View className="justify-center">
              <Text className="text-2xl">PERSONAL STATISTICS</Text>
              <View className="flex-row justify-between relative">
                <View className="mr-12 items-center justify-center">
                  <Text>From The Beginning</Text>
                  {statistic.incomingCallHistory !== undefined &&
                  <Text className="text-4xl font-bold"> 
                    {statistic.incomingCallHistory.length + statistic.outgoingCallHistory.length} Calls
                  </Text>}
                </View>
                <View className="items-center ml-12">
                  <Image
                      className="z-0"
                      source={require("../../assets/images/ProgressCircle.png")}
                  />
                  <View className='z-10 absolute mt-5 items-center'>
                      <Text className="text-3xl text-[#00278A] font-bold">{statistic.deepfakeCallPercentage}</Text>
                      <Text className="text-lg text-[#00278A] font-bold">
                      Deepfake
                      </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className=" flex gap-y-2 items-center">
          <View className="flex flex-row w-full justify-between items-center">
            <Text className="text-4xl font-bold ">Calls</Text>
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          </View>
          <View className="flex flex-row  rounded-md w-1/2 bg-[#D9D9D9] items-center justify-between">
          <SegmentedButtons 
              className='bg-white'
              value={value}
              onValueChange={setValue}
              buttons={[
                  {value: "in",
                  label: "Incoming"
                  },
                  {value: "out",
                  label: "Outgoing"
                  }
              ]}
          />
          </View>
          <Text className="text-2xl w-full">Recent</Text>
          <View className=" bg-[#D9D9D9] w-full rounded-3xl h-1/2">
            {statistic.incomingCallHistory !== undefined && value === 'in' && <CallHistory histories={statistic.incomingCallHistory}></CallHistory>}
            {statistic.outgoingCallHistory !== undefined && value === 'out' && <CallHistory histories={statistic.outgoingCallHistory}></CallHistory>}
          </View>
        </View>
      </View>
    </View>
  );
}