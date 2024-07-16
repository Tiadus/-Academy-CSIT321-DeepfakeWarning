import {View, Text, Button} from 'react-native';
import { router } from "expo-router";

export default function Info() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Info Screen</Text>
            <Button title='Call' onPress={() => {
                router.push('/incall')
            }}/>
        </View>
    )
}