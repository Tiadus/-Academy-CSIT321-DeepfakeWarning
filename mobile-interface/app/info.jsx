import {View, Text, Button, Image, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalStatus";
import { images } from "../constants";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

export default function Info() {
    const {focusContact, user, setCallProcess} = useGlobalContext();

    const handleCallPress = async () => {
        const callInformation = {
            mode: 'outgoing',
            user: user,
            contact: focusContact
        }
        setCallProcess(callInformation);
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
        <SafeAreaView className="flex-col items-center bg-background-primary">
            <View className='h-full w-11/12 bg-background-primary'>
                <View className='flex-col w-full mt-8 mb-8 items-center'>
                    <View className='flex items-center justify-center w-[180px] h-[180px] overflow-hidden rounded-full border-solid border-4 mb-4 border-app-secondary'>
                        <Image 
                            source={{uri: ('http://localhost:4000/' + focusContact.avatar)}} 
                            className="w-[180px] h-[180px] overflow-hidden rounded-full"
                        />
                    </View>
                    <View>
                        <Text className="font-bold text-4xl text-text-primary">{focusContact.user_name}</Text>
                    </View>
                </View>
                <View className='flex-row w-full rounded-lg mb-8 bg-background-tertiary'>
                    <View className='flex-col w-10/12 p-1 pl-2'>
                        <Text className='text-lg text-text-primary'>Salos Number</Text>
                        <Text className='text-lg text-text-warning'>
                            {focusContact ? (focusContact.user_id ? focusContact.user_id : 'Not Available') : 'Not Available'}
                        </Text>
                    </View>
                    <View className='flex-1 rounded-lg bg-background-primary'>
                        <TouchableOpacity onPress={handleCallPress} className='flex-1 items-center justify-center w-full border border-app-primary rounded-lg bg-background-secondary'>
                            <Ionicons name='call' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='w-full gap-y-2 mb-8'>
                    <TouchableOpacity onPress={handleAddContact} className='rounded-lg p-1 pl-2 bg-background-tertiary'>
                        <Text className='text-lg text-app-primary-glow'>Add To Contacts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteContact} className='rounded-lg p-1 pl-2 bg-background-tertiary'>
                        <Text className='text-lg text-text-danger'>Delete From Contacts</Text>
                    </TouchableOpacity>
                </View>
                <View className='w-full gap-y-2 mb-8'>
                    <TouchableOpacity onPress={handleBlockContact} className='rounded-lg p-1 pl-2 bg-background-tertiary'>
                        <Text className='text-lg text-text-danger'>Block User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUnblockContact} className='rounded-lg p-1 pl-2 bg-background-tertiary'>
                        <Text className='text-lg text-app-primary-glow'>Unblock User</Text>
                    </TouchableOpacity>
                </View>
                <View className='w-full gap-y-2'>
                    <TouchableOpacity onPress={handleReportUser} className='rounded-lg p-1 pl-2 bg-background-tertiary'>
                        <Text className='text-lg text-text-danger'>Report User</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}