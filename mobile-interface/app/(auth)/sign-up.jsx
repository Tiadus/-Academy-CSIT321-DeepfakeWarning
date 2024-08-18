import { useEffect, useState, useRef } from "react";
import {View, Text, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import { router } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { images } from "../../constants";
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';

export default function Signup() {
  const [userName, onChangeUserName] = useState('');
  const [userEmail, onChangeUserEmail] = useState('');
  const [userPhone, onChangeUserPhone] = useState('');
  const [userPassword, onChangeUserPassword] = useState('');
  const [userConfirmPassword, onChangeUserConfirmPassword] = useState('');
  
  const handleRegister = async () => {
    if (userName === '' || userEmail === '' || userPhone === '' || userPassword === '' || userConfirmPassword === '') {
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

    if (isNaN(userPhone) === true) {
      Alert.alert(
        'Warning',
        'Phone must be a number',
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
          { text: 'OK' },
        ],
        { cancelable: false }
      );
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/register', {
        email: userEmail,
        user_name: userName,
        phone: userPhone,
        user_password: userPassword
      });
    
      Alert.alert(
        'Message',
        'Account Successfully Registered',
        [
          { text: 'OK', onPress: () => router.replace('sign-in') },
        ],
        { cancelable: false }
      );
      return;
    } catch (error) {
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

  return (
    <KeyboardAwareScrollView 
      className="bg-background-primary h-full" 
      keyboardVerticalOffset={0 + 47}
      behavior="padding"
      style={{ flex: 1 }}
      enabled
    >
      <View className="h-full items-center bg-background-primary" >
        <View className="items-center w-full mt-20 mb-4">
          <LinearGradient
              className='items-center justify-center w-[110px] h-[110px] rounded-full p-2 mb-4'
              start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
              colors={['#0B5DFB', '#99008A']}
          >
            <View className='items-center justify-center w-[95px] h-[95px] rounded-full'>
              <Image
                source={images.logo}
                className="w-full h-full"
              />
            </View>
          </LinearGradient>
          <Text className="font-bold text-5xl text-text-primary">REGISTER</Text>
        </View>
        <View className="w-10/12">
          <Text className="mb-2 font-bold text-lg text-text-primary">Full Name</Text>
          <TextInput
            className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
            placeholder="Enter Your Full Name"
            placeholderTextColor="#F1F1F1"
            onChangeText={(value) => onChangeUserName(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="mb-2 font-bold text-lg text-text-primary">Email</Text>
          <TextInput
            className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
            placeholder="Enter Your Email"
            placeholderTextColor="#F1F1F1"
            onChangeText={(value) => onChangeUserEmail(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="mb-2 font-bold text-lg text-text-primary">Phone Number</Text>
          <TextInput
            className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
            placeholder="Enter Your Phone Number"
            placeholderTextColor="#F1F1F1"
            onChangeText={(value) => onChangeUserPhone(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="mb-2 font-bold text-lg text-text-primary">Password</Text>
          <TextInput
            className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
            placeholder="Enter Your Password"
            placeholderTextColor="#F1F1F1"
            onChangeText={(value) => onChangeUserPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <View className="w-10/12 mb-4">
          <Text className="mb-2 font-bold text-lg text-text-primary">Confirm Password</Text>
          <TextInput
            className="border-2 border-border-outline rounded-xl p-2 mb-2 text-text-primary"
            placeholder="Confirm Your Password"
            placeholderTextColor="#F1F1F1"
            onChangeText={(value) => onChangeUserConfirmPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          className="items-center justify-center w-10/12 h-12 rounded-xl mb-4 bg-button-secondary"
          onPress={handleRegister}
        >
          <Text className="text-text-primary">REGISTER</Text>
        </TouchableOpacity>
        <Text className="text-lg text-text-primary">Already have an account?</Text>
        <TouchableOpacity
          onPress={() => {
            router.replace('sign-in')
          }}
        >
          <Text className="font-bold text-lg underline text-text-primary">Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  )
}