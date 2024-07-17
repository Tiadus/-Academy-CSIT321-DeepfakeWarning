import React, { useEffect, useState } from "react";
import {View, Text, Button} from 'react-native'
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalStatus";

export default function Setting() {
    const {user, setUser} = useGlobalContext();
    const {webSocket, setWebSocket} = useGlobalContext();

    useEffect(() => {
        if (user === null) {
            setWebSocket(null);
        }
    }, [user]);

    useEffect(() => {
    if (webSocket === null) {
        router.navigate('/');
    }
    }, [webSocket]);

    const handleLogout = async () => {
        webSocket.close();
        setUser(null);
    }

    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Setting Screen</Text>
            <Button title='Signout' onPress={handleLogout}/>
        </View>
    )
}