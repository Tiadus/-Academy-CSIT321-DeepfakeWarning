import {View, Text, Button} from 'react-native';
import { Link, router } from "expo-router";

export default function Signup() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Signin Screen</Text>
            <Link
              href="/sign-in"
            >
              Signin
            </Link>
        </View>
    )
}