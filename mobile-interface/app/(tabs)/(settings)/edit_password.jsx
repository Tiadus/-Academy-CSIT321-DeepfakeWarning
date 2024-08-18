import {View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput} from 'react-native';
import { useGlobalContext } from "../../../context/GlobalStatus";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from "@react-navigation/native";

export default function Edit_Password() {
    const isFocused = useIsFocused();
    const {user, setUser} = useGlobalContext();
    const [userPassword, onChangeUserPassword] = useState('');
    const [userConfirmPassword, onChangeUserConfirmPassword] = useState('');

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
                    <View className="w-full gap-y-4 mt-8 mb-10">
                        <View className="w-full">
                            <Text className="mb-2 font-bold text-lg text-text-primary">New Password</Text>
                            <TextInput
                                className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
                                placeholder="Enter Your Password"
                                placeholderTextColor="#F1F1F1"
                                onChangeText={(value) => onChangeUserPassword(value)}
                                secureTextEntry={true}
                            />
                        </View>
                        <View className="w-full">
                            <Text className="mb-2 font-bold text-lg text-text-primary">Confirm Password</Text>
                            <TextInput
                                className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
                                placeholder="Confirm Your Password"
                                placeholderTextColor="#F1F1F1"
                                onChangeText={(value) => onChangeUserConfirmPassword(value)}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    <View className="w-full gap-y-4">
                        <TouchableOpacity
                            className="items-center justify-center h-12 rounded-xl mb-4 bg-button-secondary"
                        >
                            <Text className="text-text-primary">Change Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}