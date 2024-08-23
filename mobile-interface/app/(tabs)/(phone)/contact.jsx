import {View, Text, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import ContactList from '../../../components/ContactList'
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalStatus";
import axios from 'axios';

export default function Contact() {
    const {user} = useGlobalContext();
    const isFocused = useIsFocused();
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (isFocused == true) {
            retrieveContacts('');
        }
    }, [isFocused])

    const retrieveContacts = async (name) => {
        try{
            const contacts = await axios.get(`http://localhost:4000/api/contact?name=${name}`, {
              headers: {
                'Authorization': user.auth,
                'Content-Type': 'application/json'
              }
            });
            
            setContacts(contacts.data.contacts);
            return;
          } catch(error) {
            console.log(error);
          }
    }

    const handleSearchIconPress = async () => {
        try {
            router.push('/search')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='flex h-full w-11/12 bg-background-primary'>
                <View className='flex-row mt-20 mb-10'>
                    <View className='w-1/2'>
                        <Text className='font-extrabold text-4xl text-text-primary'>CONTACTS</Text>
                    </View>
                    <View className='flex w-1/2'>
                        <TouchableOpacity onPress={handleSearchIconPress} className='self-end flex-1 items-center justify-center w-1/4 border border-app-secondary-glow rounded-lg bg-background-secondary'>
                            <Ionicons name='person-add-outline' style={{ fontSize: 40, color: "#0793F9" }}/> 
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="w-full border-4 border-border-outline rounded-xl p-2 mb-8">
                    <TextInput
                    className='text-text-primary'
                    placeholder="SEARCH"
                    placeholderTextColor="#F1F1F1"
                    onChangeText={(value) => retrieveContacts(value)}
                    />
                </View>
                <View className='w-full h-2/3'>
                    <ContactList className='w-full' contacts={contacts ? contacts : {}}></ContactList>
                </View>
            </View>
        </SafeAreaView>
    )
}