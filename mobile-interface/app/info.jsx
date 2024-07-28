import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalStatus";
import { images } from "../constants";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Info() {
    const {focusContact} = useGlobalContext();
    const handleCallPress = async () => {
        router.push('/incall')
    }

    return (
        <View className="bg-white h-full items-center flex-col">
            <View 
                className='overflow-hidden rounded-full border-solid border-4 border-fuchsia-700 w-48 h-48 items-center mt-8 mb-12'>
                <Image 
                    source={{uri: ('http://localhost:4000/' + focusContact.avatar)}} 
                    className="w-[210px] h-[210px] mb-12 overflow-hidden rounded-full"
                />
            </View>
            <View className="w-11/12 border-b pb-1 border-gray-400 mb-4">
                <Text className="text-lg self-start mb-2 text-gray-400 font-bold">Full Name</Text>
                <View className='flex-row'>
                    <Ionicons name='person-circle' style={{ fontSize: 30 }}/>
                    <Text className="text-lg ml-2">{focusContact.user_name}</Text>
                </View>
            </View>
            <View className="w-11/12 border-b pb-1 border-gray-400 mb-8">
                <Text className="text-lg self-start mb-2 text-gray-400 font-bold">Phone Number</Text>
                <View className='flex-row'>
                    <Ionicons name='call' style={{ fontSize: 30 }}/>
                    <Text className="text-lg ml-2">{focusContact.user_id}</Text>
                </View>
            </View>
            <View className="w-11/12 pb-1 border-gray-400 mb-4">
                <TouchableOpacity>
                    <Text className="text-lg self-start text-orange-500 font-bold">Block Contact</Text>
                </TouchableOpacity>
            </View>
            <View className="w-11/12 pb-1 border-gray-400">
                <TouchableOpacity>
                    <Text className="text-lg self-start text-red-700 font-bold">Delete Contact</Text>
                </TouchableOpacity>
            </View>
            <View className='flex-1 items-center justify-center'>
                <TouchableOpacity
                    className='bg-green-500 rounded-full p-2 border-solid border border-gray-600'
                    onPress={handleCallPress}
                >
                    <Ionicons name='call' style={{ fontSize: 40, color: 'white' }}/> 
                </TouchableOpacity>
            </View>
        </View>
    )
}