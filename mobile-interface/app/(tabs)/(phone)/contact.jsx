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

    //Reset the data upon focus
    useEffect(() => {
        if (isFocused == true) {
            retrieveContacts('');
        }
    }, [isFocused])

    /**
     * Retrieves contacts from the server based on a specified name.
     *
     * This function sends a GET request to the API to fetch contacts that match
     * the provided name. The authorization header is included for authentication.
     * If the request is successful, the retrieved contacts are stored in the state. 
     * In case of an error, the error is logged to the console.
     * 
     * @async
     * @function retrieveContacts
     * @param {string} name - The name to filter contacts by.
     * @returns {Promise<void>} Resolves once the contacts are retrieved or an error is handled.
     * @throws Will log errors to the console if the request fails.
     */
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

    /**
     * Handles the press event for the search icon by navigating to the search page.
     *
     * This function attempts to push the user to the search page using the router.
     * In case of an error during the navigation process, the error is logged to the console.
     * 
     * @async
     * @function handleSearchIconPress
     * @returns {Promise<void>} Resolves once the navigation is attempted or an error is handled.
     * @throws Will log errors to the console if the navigation fails.
     */
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