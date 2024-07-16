import {View, Text, Button} from 'react-native';
import { router } from "expo-router";

export default function Contact() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Contact Screen</Text>
            <Button title='A Contact' onPress={() => {
                router.push('/info')
            }}/>

            <Button title='Numpad' onPress={() => {
                router.push('/numpad')
            }}/>
        </View>
    )
}