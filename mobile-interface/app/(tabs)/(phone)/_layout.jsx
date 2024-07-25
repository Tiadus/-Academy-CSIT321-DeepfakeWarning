import {View, Text, Button} from 'react-native';
import { router } from "expo-router";
import { Stack } from "expo-router";

export default function PhoneLayout() {
    return (
        <Stack>
            <Stack.Screen name="contact" options={{ headerShown: false }}/>
        </Stack>
    )
}