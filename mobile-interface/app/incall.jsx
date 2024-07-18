import React, { useEffect, useState } from "react";
import {View, Text, Button} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalStatus";

import {
    ClientRoleType,
} from 'react-native-agora';

export default function Incall() {
    const {config, agoraEngine, user} = useGlobalContext();
    const [inCall, setInCall] = useState(true);

    useEffect(() => {
        if (agoraEngine === null) {
            console.log('Agora Engine Unavailable');
        }

        if (agoraEngine !== null && user !== null) {
            try {
                // Call the joinChannel method to join the channel
                agoraEngine.joinChannel(config.token, config.channel, parseInt(user.clientID), {
                  // Set the user role to broadcaster
                  clientRoleType: ClientRoleType.ClientRoleBroadcaster,
              });
                console.log('Joining Channel')
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    useEffect(() => {
        if (inCall === false) {
            agoraEngine.leaveChannel();
            router.back();
        }
    }, [inCall])

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
                setInCall(false);
            }}/>
        </View>
    )
}