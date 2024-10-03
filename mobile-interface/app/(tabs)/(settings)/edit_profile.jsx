import {View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput, Alert} from 'react-native';
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

    //Reset data upon focused
    useEffect(() => {
        if (isFocused == true) {
          try {
            onChangeUserName(user.user_name)
            onChangeUserEmail(user.email)
            onChangeUserPhone(user.phone)
          } catch (error) {
            console.log(error);
          }
        }
    }, [isFocused])

    /**
     * Saves the user's profile information by sending a POST request to update the profile.
     *
     * This function validates that the user name, email, and phone fields are filled. 
     * If validation is successful, it sends a request to the API to update the user's 
     * profile information. Upon successful update, an alert is shown to confirm the 
     * change, and the user information is updated in the state. If there are errors 
     * during the process, appropriate alerts are shown.
     * 
     * @async
     * @function saveProfile
     * @returns {Promise<void>} Resolves once the profile information is saved or an error is handled.
     * @throws Will show alerts for empty fields, invalid credentials, or other errors.
     */
    const saveProfile = async () => {
        if (userName === '' || userEmail === '' || userPhone === '') {
            Alert.alert(
              'Warning',
              'Please Do Not Leave The Information Blank',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            );
            return;
        }
        
        try {
            const updateProfileResult = await axios.post('http://localhost:4000/api/profile', {
                mode: "profile",
                email: userEmail,
                user_name: userName,
                avatar: user.avatar,
                phone: userPhone
            }, {
              headers: {
                'Authorization': user.auth,
                'Content-Type': 'application/json'
              }
            });
      
            const userInfo = updateProfileResult.data.user;
            userInfo.user_id = updateProfileResult.data.user.user_id.toString();
            
            setUser(userInfo);

            Alert.alert(
                'Message',
                'Information Has Been Saved',
                [
                  { text: 'OK' },
                ],
                { cancelable: false }
              );
              return;
          } catch(error) {
            if (error.response && error.response.status) {
              let errorStatus = error.response.status;
              let errorMessage = error.response.data.error;
              if (errorStatus === 401) {
                errorMessage = 'Invalid Credential'
              }
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
                            onPress={saveProfile}
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