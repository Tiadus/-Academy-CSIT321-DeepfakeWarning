import {View, Text, Button} from 'react-native';
import { router } from "expo-router";
import { Stack } from "expo-router";

export default function PhoneLayout() {
    return (
        <Stack>
            <Stack.Screen name="contact" options={{ headerShown: false }}/>
            <Stack.Screen name="search" options={{ 
                title: "USER SEARCHING", 
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#000003', // Background Color
                },
                headerTintColor: '#F1F1F1', // Text Color
                headerTitleStyle: {
                    fontWeight: '800', // Font Weight
                },
            }}/>
        </Stack>
    )
}