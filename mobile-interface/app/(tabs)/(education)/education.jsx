import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";

export default function Education() {
    return (
        <View className='items-center h-full bg-white flex-col'>
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
                <TouchableOpacity
                    className='flex-row mb-6'
                    onPress={() => {
                        router.navigate('content')
                    }}
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>01</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Understanding Audio Deepfakes: The New Frontier of Fraud</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>02</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Securing Social Media Accounts: A Comprehensive Guide</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>03</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Recognizing Fake Websites: A Guide to Staying Safe Online</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>04</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Safe Online Shopping Practices: A Comprehensive Guide</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>05</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Identifying phishing emails</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>06</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Reporting and Blocking Spam Emails and Messages</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row mb-6'
                >
                    <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                        <Text className='text-lg font-bold'>07</Text>
                    </View>
                    <View className='ml-2 justify-center flex-1 overflow-hidden'>
                        <Text numberOfLines={2} className='text-lg font-bold'>Understanding Privacy Settings</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}