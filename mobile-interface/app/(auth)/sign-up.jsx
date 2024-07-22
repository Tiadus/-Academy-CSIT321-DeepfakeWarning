import { useEffect, useState } from "react";
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import { Link, router } from "expo-router";

import { images } from "../../constants";

export default function Signup() {
  const [userName, onChangeUserName] = useState('');
  const [userEmail, onChangeUserEmail] = useState('');
  const [userPassword, onChangeUserPassword] = useState('');
  const [userConfirmPassword, onChangeUserConfirmPassword] = useState('');
  return (
    <View className="items-center">
      <Image
        source={images.logo}
        className="w-[110px] h-[110px] mb-10 mt-20"
      />
      <Text className="font-bold text-5xl mb-10">REGISTER</Text>
      <View className="w-10/12">
        <Text className="font-bold text-lg self-start mb-2">Full Name</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Enter Your Full Name"
          onChange={onChangeUserName}
        />
      </View>
      <View className="w-10/12">
        <Text className="font-bold text-lg self-start mb-2">Email/Phone Number</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Enter Your Email/Phone Number"
          onChange={onChangeUserEmail}
        />
      </View>
      <View className="w-10/12">
        <Text className="font-bold text-lg self-start mb-2">Password</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Enter Your Password"
          onChange={onChangeUserPassword}
          secureTextEntry={true}
        />
      </View>
      <View className="w-10/12 mb-4">
        <Text className="font-bold text-lg self-start mb-2">Confirm Password</Text>
        <TextInput
          className="border rounded-xl p-2 mb-2"
          placeholder="Confirm Your Password"
          onChange={onChangeUserConfirmPassword}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        className="rounded-xl w-10/12 items-center justify-center h-12 mb-8"
        style={{backgroundColor: '#343434'}}
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
  )
}