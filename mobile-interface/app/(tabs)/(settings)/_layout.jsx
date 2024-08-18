import {View, Text, Button} from 'react-native';
import { router } from "expo-router";
import { Stack } from "expo-router";

export default function SettingLayout() {
    return (
        <Stack>
            <Stack.Screen name="setting" options={{ headerShown: false }}/>
            <Stack.Screen name="edit_profile" options={{ 
                title: "EDIT PROFILE", 
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#000003', // Background Color
                },
                headerTintColor: '#F1F1F1', // Text Color
                headerTitleStyle: {
                    fontWeight: '800', // Font Weight
                },
            }}/>
            <Stack.Screen name="edit_password" options={{ 
                title: "CHANGE PASSWORD", 
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