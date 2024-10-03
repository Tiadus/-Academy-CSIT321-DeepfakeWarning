import {View, Text, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import EducationTitle from '../../../components/EducationTitle';

export default function Education() {
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused == true) {
            retrieveEducationTitles();
        }
    }, [isFocused]);

    const [titles, setTitles] = useState([]);

    /**
     * Retrieves the lesson title from the server based on the specified ID.
     *
     * This function sends a GET request to the API to fetch all 
     * the lessons title and their id
     * 
     * @async
     * @function retrieveContentBody
     * @returns {Promise<void>} Resolves once the titles is retrieved or an error is handled.
     * @throws Will log errors to the console if the request fails.
     */
    const retrieveEducationTitles = async () => {
        try{
            const titleRequestResult = await axios.get('http://localhost:4000/api/education?mode=title');
            
            setTitles(titleRequestResult.data.titles);
            return;
          } catch(error) {
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
          }
    }

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='h-full w-11/12 bg-background-primary'>
                <View className='flex-col mt-20 mb-10'>
                    <Text className='font-extrabold text-4xl text-text-primary'>LESSONS</Text>
                </View>
                <ScrollView className= 'h-full w-full flex-1'>
                    {titles.map((title) => (
                        <EducationTitle key={title.education_id} education={title}></EducationTitle>
                    ))}
                </ScrollView>
            </View>
        {
        /*<View className='items-center h-full bg-white flex-col'>
            <View className='items-center justify-center mt-20 mb-4'>
                <LinearGradient 
                    className='rounded-full p-2'
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                    colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                >
                    <View
                        className='bg-green-500 rounded-full p-1'
                    >
                        <Ionicons name='book' style={{ fontSize: 40, color: "white" }}/> 
                    </View>
                </LinearGradient>
            </View>
            <View className='text-2xl mb-8 flex-row'>
                <Text className='text-2xl text-blue-900 font-extrabold'>Educational </Text>
                <Text className='text-2xl text-fuchsia-800 font-extrabold'>Content</Text>
            </View>
            <ScrollView className= 'h-full w-10/12 flex-1'>
                {titles.map((title) => (
                    <EducationTitle key={title.education_id} education={title}></EducationTitle>
                ))}
            </ScrollView>
        </View>*/
        }
        </SafeAreaView>
    )
}