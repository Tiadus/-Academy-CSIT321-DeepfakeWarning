import {View, Text, Button} from 'react-native'
import { router } from "expo-router";

export default function Setting() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Setting Screen</Text>
            <Button title='Signout' onPress={() => {
                router.navigate('/')
            }}/>
        </View>
    )
}