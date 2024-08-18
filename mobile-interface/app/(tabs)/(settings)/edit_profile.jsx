import {View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput} from 'react-native';
import { useGlobalContext } from "../../../context/GlobalStatus";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";

export default function Edit_Profile() {
    const isFocused = useIsFocused();
    const {user, setUser} = useGlobalContext();
    const [userName, onChangeUserName] = useState(user.user_name);
    const [userEmail, onChangeUserEmail] = useState(user.email);
    const [userPhone, onChangeUserPhone] = useState(user.phone);

    useEffect(() => {
        if (isFocused == true) {
          try {

          } catch (error) {
            console.log(error);
          }
        }
    }, [isFocused])

    return(
        <KeyboardAwareScrollView 
            className="h-full bg-background-primary"
            keyboardVerticalOffset={0 + 47}
            behavior="padding"
            style={{ flex: 1 }}
            enabled
        >
            <SafeAreaView className="items-center w-full h-full bg-background-primary" >
                <View className='flex flex-col w-11/12 h-full bg-background-primary'>
                    <View className='flex-col w-full mt-4 mb-4 items-center'>
                        <View className='flex items-center justify-center w-[150px] h-[150px] overflow-hidden rounded-full border-solid border-4 border-app-secondary'>
                            <Image 
                                source={{uri: ('http://localhost:4000/' + user.avatar)}} 
                                className="w-[150px] h-[150px] overflow-hidden rounded-full"
                            />
                        </View>
                    </View>
                    <View className="w-full gap-y-4 mb-8">
                        <View className="w-full">
                            <Text className="mb-2 font-bold text-lg text-text-primary">Full Name</Text>
                            <TextInput
                                value={userName}
                                className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
                                placeholder="Enter Your Full Name"
                                placeholderTextColor="#F1F1F1"
                                onChangeText={(value) => onChangeUserName(value)}
                            />
                        </View>
                        <View className="w-full">
                            <Text className="mb-2 font-bold text-lg text-text-primary">Email</Text>
                            <TextInput
                            value={userEmail}
                                className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
                                placeholder="Enter Your Email"
                                placeholderTextColor="#F1F1F1"
                                onChangeText={(value) => onChangeUserEmail(value)}
                            />
                        </View>
                        <View className="w-full">
                            <Text className="mb-2 font-bold text-lg text-text-primary">Phone Number</Text>
                            <TextInput
                                value={userPhone}
                                className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
                                placeholder="Enter Your Phone Number"
                                placeholderTextColor="#F1F1F1"
                                onChangeText={(value) => onChangeUserPhone(value)}
                            />
                        </View>
                    </View>
                    <View className="w-full gap-y-4">
                        <TouchableOpacity
                            onPress={() => {router.push('/edit_password')}}
                            className="items-center justify-center h-12 rounded-xl mb-4 bg-button-secondary"
                        >
                            <Text className="text-text-primary">Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="items-center justify-center h-12 rounded-xl mb-4 bg-button-primary"
                        >
                            <Text className="text-text-primary">Save Information</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}