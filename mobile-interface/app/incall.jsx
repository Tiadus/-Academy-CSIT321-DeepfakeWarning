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
            <Text>In Call Screen</Text>
            <Button title='End Call' onPress={() => {
                router.back();
            }}/>
        </View>
    )
}