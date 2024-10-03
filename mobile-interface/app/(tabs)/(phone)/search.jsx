import {View, Text, Button, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import ContactList from '../../../components/ContactList'
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import UserList from '../../../components/UserList'

export default function Search() {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchedName, setSearchedName] = useState('');

    /**
     * Retrieves users from the server based on a specified name.
     *
     * This function sends a GET request to the API to fetch users that match
     * the provided name. If the request is successful, the retrieved users are
     * stored in the state. In case of an error, the error is logged to the console.
     * 
     * @async
     * @function retrieveUsers
     * @returns {Promise<void>} Resolves once the users are retrieved or an error is handled.
     * @throws Will log errors to the console if the request fails.
     */
    const retrieveUsers = async () => {
        try{
            const users = await axios.get(`http://localhost:4000/api/user?name=${searchedName}`);
            setSearchedUsers(users.data.users);
            return;
          } catch(error) {
            console.log(error);
          }
    }

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='flex flex-col h-full w-11/12 bg-background-primary'>
                <View className="flex-row w-full border-4 border-border-outline rounded-xl mt-8 mb-6">
                    <View className="w-10/12 rounded-xl p-2">
                        <TextInput
                        className='text-text-primary'
                        placeholder="SEARCH"
                        placeholderTextColor="#F1F1F1"
                        onChangeText={(value) => setSearchedName(value)}
                        />
                    </View>
                    <View className='flex-1 rounded-lg'>
                        <TouchableOpacity onPress={retrieveUsers} className='flex-1 items-center justify-center w-full border-l-4 border-border-outline rounded-lg bg-background-secondary'>
                            <Ionicons name='search' style={{ fontSize: 40, color: "#F1F1F1" }}/> 
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='w-full h-5/6'>
                    {searchedUsers.length === 0 &&
                        <View className='flex-1 items-center justify-center w-full h-full bg-background-primary'>
                            <Ionicons name='search' style={{ fontSize: 150, color: "#767676" }}/>
                            <Text className="text-text-secondary">Search For A User To Connect</Text>
                        </View>
                    }
                    {searchedUsers.length > 0 &&
                        <UserList className='w-full' users={searchedUsers}></UserList>
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}