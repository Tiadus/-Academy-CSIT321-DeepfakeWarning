import {View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput, Alert} from 'react-native';
import { useGlobalContext } from "../../../context/GlobalStatus";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";

export default function Edit_Password() {
    const isFocused = useIsFocused();
    const {user, setUser} = useGlobalContext();
    const [userPassword, onChangeUserPassword] = useState('');
    const [userConfirmPassword, onChangeUserConfirmPassword] = useState('');

    //Reset data upon focused
    useEffect(() => {
        if (isFocused == true) {
          try {

          } catch (error) {
            console.log(error);
          }
        }
    }, [isFocused])

    /**
     * Saves the new password by sending a POST request to update the user's profile.
     *
     * This function validates that the password fields are filled and that they match. 
     * If the validation is successful, it sends a request to the API to update the user's 
     * password. Upon successful update, an alert is shown to confirm the change, and the 
     * user information is updated in the state. If there are errors during the process, 
     * appropriate alerts are shown.
     * 
     * @async
     * @function savePassword
     * @returns {Promise<void>} Resolves once the password is saved or an error is handled.
     * @throws Will show alerts for empty fields, mismatched passwords, invalid credentials, 
     *         or other errors.
     */
    const savePassword = async () => {
        if (userPassword === '' || userConfirmPassword === '') {
            Alert.alert(
              'Warning',
              'Please Input All Information',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            );
            return;
          }
      
          if (userPassword != userConfirmPassword) {
            Alert.alert(
              'Warning',
              'Password and Confirmation do not match',
              [
                { text: 'OK', },
              ],
              { cancelable: false }
            );
            return;
          }
        
        try {
            const updateProfileResult = await axios.post('http://localhost:4000/api/profile', {
                mode: "password",
                user_password: userPassword
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
                'Password Has Been Changed',
                [
                  { text: 'OK', onPress: () => {router.back();} },
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
                            onPress={savePassword}
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