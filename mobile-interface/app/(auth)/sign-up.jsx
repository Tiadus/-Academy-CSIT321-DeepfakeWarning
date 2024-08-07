import { useEffect, useState, useRef } from "react";
import {View, Text, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import { Link, router } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { images } from "../../constants";
import axios from 'axios';

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
      className="bg-white h-full" 
      keyboardVerticalOffset={0 + 47}
      behavior="padding"
      style={{ flex: 1 }}
      enabled
    >
      <View className="bg-white h-full items-center" >
        <Image
          source={images.logo}
          className="w-[110px] h-[110px] mb-10 mt-20"
        />
        <Text className="font-bold text-5xl mb-1">REGISTER</Text>
        <View className="w-10/12">
          <Text className="font-bold text-lg self-start mb-2">Full Name</Text>
          <TextInput
            className="border rounded-xl p-2 mb-2"
            placeholder="Enter Your Full Name"
            onChangeText={(value) => onChangeUserName(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="font-bold text-lg self-start mb-2">Email</Text>
          <TextInput
            className="border rounded-xl p-2 mb-2"
            placeholder="Enter Your Email"
            onChangeText={(value) => onChangeUserEmail(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="font-bold text-lg self-start mb-2">Phone Number</Text>
          <TextInput
            className="border rounded-xl p-2 mb-2"
            placeholder="Enter Your Phone Number"
            onChangeText={(value) => onChangeUserPhone(value)}
          />
        </View>
        <View className="w-10/12">
          <Text className="font-bold text-lg self-start mb-2">Password</Text>
          <TextInput
            className="border rounded-xl p-2 mb-2"
            placeholder="Enter Your Password"
            onChangeText={(value) => onChangeUserPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <View className="w-10/12 mb-4">
          <Text className="font-bold text-lg self-start mb-2">Confirm Password</Text>
          <TextInput
            className="border rounded-xl p-2 mb-2"
            placeholder="Confirm Your Password"
            onChangeText={(value) => onChangeUserConfirmPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          className="rounded-xl w-10/12 items-center justify-center h-12 mb-4"
          style={{backgroundColor: '#343434'}}
          onPress={handleRegister}
        >
          <Text className="text-white">REGISTER</Text>
        </TouchableOpacity>
        <Text className="text-lg">Already have an account?</Text>
        <Link
          className="font-bold text-lg underline"
          href="/sign-in"
        >
          Sign In
        </Link>
      </View>
    </KeyboardAwareScrollView>
  )
}