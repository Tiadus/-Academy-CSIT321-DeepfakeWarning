import {View, Text, Button} from 'react-native';
import { Link, router } from "expo-router";

export default function Signin() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Signin Screen</Text>
            <Button title='Enter' onPress={() => {
                router.push('/home')
            }}/>
            <Link
              href="/sign-up"
            >
              Signup
            </Link>
        </View>
    )
}