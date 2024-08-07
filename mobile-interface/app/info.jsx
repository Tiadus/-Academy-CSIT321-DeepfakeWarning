import {View, Text, Button, Image, TouchableOpacity, Alert} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalStatus";
import { images } from "../constants";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

export default function Info() {
    const {focusContact, user} = useGlobalContext();

    const handleCallPress = async () => {
        router.push('/incall')
    }

    const handleAddContact = async () => {
        try {
            const addContactResult = await axios.post('http://localhost:4000/api/contact', 
                {
                    mode: 'add',
                    contact_id: focusContact.user_id
                }, 
                {
                    headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json'
                    }
                }
            );
            
            Alert.alert(
                'Message',
                addContactResult.data.message,
                [],
                { cancelable: true }
              );
              return;
            //onPress: () => {router.back()}
        } catch (error) {
            if (error.response && error.response.status && error.response.data.error) {
                let errorMessage = error.response.data.error;
                Alert.alert(
                  'Warning',
                  errorMessage,
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                );
                return;
              } else {
                console.log(error);
              }
        }
    }

    const handleBlockContact = async () => {
        try {
            const blockContactResult = await axios.post('http://localhost:4000/api/user', 
                {
                    mode: 'block',
                    contact_id: focusContact.user_id,
                    blockStatus: 1
                }, 
                {
                    headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json'
                    }
                }
            );

            Alert.alert(
                'Message',
                blockContactResult.data.message,
                [
                    {text: 'OK'}
                ],
                { cancelable: true }
              );
              return;
        } catch (error) {
            if (error.response && error.response.status && error.response.data.error) {
                let errorMessage = error.response.data.error;
                Alert.alert(
                  'Warning',
                  errorMessage,
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                );
                return;
              } else {
                console.log(error);
              }
        }
    }

    const handleUnblockContact = async () => {
        try {
            const blockContactResult = await axios.post('http://localhost:4000/api/user', 
                {
                    mode: 'block',
                    contact_id: focusContact.user_id,
                    blockStatus: 0
                }, 
                {
                    headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json'
                    }
                }
            );

            Alert.alert(
                'Message',
                blockContactResult.data.message,
                [
                    {text: 'OK'}
                ],
                { cancelable: true }
              );
              return;
        } catch (error) {
            if (error.response && error.response.status && error.response.data.error) {
                let errorMessage = error.response.data.error;
                Alert.alert(
                  'Warning',
                  errorMessage,
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                );
                return;
              } else {
                console.log(error);
              }
        }
    }

    const handleDeleteContact = async () => {
        try {
            const deleteContactResult = await axios.post('http://localhost:4000/api/contact', 
                {
                    mode: 'del',
                    contact_id: focusContact.user_id
                }, 
                {
                    headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json'
                    }
                }
            );

            Alert.alert(
                'Message',
                deleteContactResult.data.message,
                [
                    {text: 'OK', onPress: () => {router.back();}}
                ],
                { cancelable: true }
              );
              return;
        } catch (error) {
            if (error.response && error.response.status && error.response.data.error) {
                let errorMessage = error.response.data.error;
                Alert.alert(
                  'Warning',
                  errorMessage,
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                );
                return;
              } else {
                console.log(error);
              }
        }
    }

    const handleReportUser = async () => {
        try {
            const deleteContactResult = await axios.post('http://localhost:4000/api/user', 
                {
                    mode: 'report',
                    contact_id: focusContact.user_id
                }, 
                {
                    headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json'
                    }
                }
            );

            Alert.alert(
                'Message',
                deleteContactResult.data.message,
                [
                    {text: 'OK'}
                ],
                { cancelable: true }
              );
              return;
        } catch (error) {
            if (error.response && error.response.status && error.response.data.error) {
                let errorMessage = error.response.data.error;
                Alert.alert(
                  'Warning',
                  errorMessage,
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false }
                );
                return;
              } else {
                console.log(error);
              }
        }
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
            <View className="w-11/12 flex-row">
                <View className="w-1/2">
                    <View className="w-11/12 pb-1 border-gray-400 mb-4">
                        <TouchableOpacity onPress={handleAddContact} className="bg-green-600 rounded-xl items-center p-1">
                            <Text className="text-lg text-white font-bold">Add Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-11/12 pb-1 border-gray-400 mb-4">
                        <TouchableOpacity onPress={handleDeleteContact} className="bg-red-600 rounded-xl items-center p-1">
                            <Text className="text-lg text-white font-bold">Delete Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-11/12 pb-1 border-gray-400">
                        <TouchableOpacity onPress={handleReportUser} className="bg-black rounded-xl items-center p-1">
                            <Text className="text-lg text-red-600 font-bold">Report User</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="w-1/2">
                    <View className="w-11/12 pb-1 border-gray-400 mb-4">
                        <TouchableOpacity onPress={handleBlockContact} className="bg-orange-500 rounded-xl items-center p-1">
                            <Text className="text-lg text-white font-bold">Block Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-11/12 pb-1 border-gray-400 mb-4">
                        <TouchableOpacity onPress={handleUnblockContact} className="bg-cyan-600 rounded-xl items-center p-1">
                            <Text className="text-lg text-white font-bold">Unblock Contact</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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