import {View, Text, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';
import { useIsFocused } from "@react-navigation/native";

export default function Upload() {
    const isFocused = useIsFocused();
    const [fileName, setFileName] = useState('Please Choose A File');
    const [analyseMode, setAnalyseMode] = useState(false);
    const [inProgress, setInProgress] = useState(true);

    const uploadColorSet = ['#8AE3FF', '#8AE3FF', '#8AE3FF', '#1A5AFF', '#1A5AFF', '#AEA7FF', '#AEA7FF', '#9C3AFF'];
    const detectColorSet = ['#BD8AFF', '#BD8AFF', '#BD8AFF', '#99008A', '#99008A', '#FFA7F1', '#FFA7F1', '#FF3ADF'];
    const safeColorSet = ['#096B00', '#11D100'];
    const dangerColorSet = ['#790000', '#A50000'];

    useEffect(() => {
        if (isFocused == true) {
            setFileName('Please Choose A File');
            setAnalyseMode(false);
            setInProgress(true);
        }
    }, [isFocused])

    const handleReset = async () => {
        setFileName('Please Choose A File');
        setAnalyseMode(false);
        setInProgress(true);
    }

    const handleFileUploaded = async () => {
        try {
            setFileName('sample.flac')
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileDetect = async () => {
        try {
            setAnalyseMode(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleFile = async () => {
        try {
            if (fileName === 'Please Choose A File') {
                handleFileUploaded();
            } else if (fileName !== 'Please Choose A File') {
                handleFileDetect();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='flex h-full w-11/12 bg-background-primary'>
                {analyseMode === false && <View className='h-full w-full'>
                    <View className='flex-row mt-20 mb-10'>
                        <View className='w-1/2'>
                            <Text className='font-extrabold text-4xl text-text-primary'>
                                {fileName === 'Please Choose A File' ? 'UPLOAD' : 'DETECT'}
                            </Text>
                        </View>
                        {fileName !== 'Please Choose A File' &&
                            <View className='flex w-1/2'>
                                <TouchableOpacity onPress={handleReset} className='self-end flex-1 items-center justify-center w-1/4 rounded-lg bg-[#811F00]'>
                                    <Ionicons name='refresh' style={{ fontSize: 35, color: "#F1F1F1" }}/> 
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View className='flex-1 flex-col items-center justify-center w-full gap-y-10'>
                        <TouchableOpacity onPress={handleFile}>
                            <LinearGradient
                                className='items-center justify-center w-[200px] h-[200px] rounded-full p-2'
                                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                                colors={fileName === 'Please Choose A File' ? uploadColorSet : detectColorSet}
                            >
                                <View className='items-center justify-center w-[175px] h-[175px] rounded-full bg-background-secondary'>
                                    <View className='flex-1 items-center justify-center'>
                                        <Text className='font-bold text-[30px] text-text-primary'>
                                            {fileName === 'Please Choose A File' ? 'UPLOAD' : 'DETECT'}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text className='font-bold text-2xl text-text-primary'>{fileName}</Text>
                    </View>
                </View>}
                {analyseMode === true && <View className='flex w-full h-full items-center justify-center'>
                    {inProgress === true && <View>
                        <TouchableOpacity onPress={() => {setInProgress(false)}}>
                            <Text className='font-bold text-[30px] text-text-primary'>LOADING</Text>
                        </TouchableOpacity>
                    </View>}
                    {inProgress === false && <View className='flex items-center justify-center gap-y-10 w-full'>
                        <LinearGradient
                                className='items-center justify-center w-[200px] h-[200px] rounded-full p-2'
                                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                                colors={safeColorSet}
                            >
                                <View className='items-center justify-center w-[175px] h-[175px] rounded-full bg-background-secondary'>
                                    <View className='flex-1 items-center justify-center'>
                                        <Text className='font-bold text-[30px] text-text-primary'>
                                            Safe
                                        </Text>
                                    </View>
                                </View>
                        </LinearGradient>
                        <Text className='font-bold text-2xl text-text-primary'>No Deepfake Detected</Text>
                        <TouchableOpacity onPress={handleReset} className="items-center justify-center w-full h-12 rounded-xl bg-button-primary">
                            <Text className="text-text-primary">RETURN</Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>
        </SafeAreaView>
    );
}