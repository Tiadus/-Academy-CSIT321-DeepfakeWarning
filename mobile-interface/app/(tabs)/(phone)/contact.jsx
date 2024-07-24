import {View, Text, Button, TouchableOpacity, TextInput, SafeAreaView, ScrollView, FlatList} from 'react-native';
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';
import ContactList from '../../../components/ContactList'

export default function Contact() {
    return (
        <View className='items-center h-full flex-col bg-white'>
            <Text
                className='mt-20 font-bold text-3xl mb-4'
            >
                Contacts
            </Text>
            <TextInput
                className="border rounded-xl p-2 mb-2 w-11/12"
                placeholder="SEARCH"
            />
            <View className=' w-11/12 h-4/6'>
                <ContactList>

                </ContactList>
            </View>
            <View className='flex-1 items-center justify-center'>
                <LinearGradient 
                    className='rounded-full p-2'
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                    colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                >
                    <TouchableOpacity
                        className='bg-white rounded-full p-1'
                    >
                        <Ionicons name='apps' style={{ fontSize: 40 }}/> 
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    )
}