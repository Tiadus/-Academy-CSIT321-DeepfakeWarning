import {View, Text, Button, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import ContactList from '../../../components/ContactList'
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios';

export default function Search() {
    const [searchedUsers, setSearchedUsers] = useState([]);

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='flex flex-col h-full w-11/12 bg-background-primary'>
                <View className="flex-row w-full border-4 border-border-outline rounded-xl mt-8 mb-6">
                    <View className="w-10/12 rounded-xl p-2">
                        <TextInput
                        className='text-text-primary'
                        placeholder="SEARCH"
                        placeholderTextColor="#F1F1F1"
                        />
                    </View>
                    <View className='flex-1 rounded-lg'>
                        <TouchableOpacity className='flex-1 items-center justify-center w-full border-l-4 border-border-outline rounded-lg bg-background-secondary'>
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
                </View>
            </View>
        </SafeAreaView>
    )
}