import {View, Text, Button} from 'react-native';
import { router } from "expo-router";
import { Stack } from "expo-router";

export default function EducationLayout() {
    return (
        <Stack>
            <Stack.Screen name="education" options={{ headerShown: false }}/>
            <Stack.Screen name="content" options={{ title: "Educational Content", headerShown: true }}/>
        </Stack>
    )
}