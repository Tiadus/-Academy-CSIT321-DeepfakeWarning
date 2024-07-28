import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { useGlobalContext } from "../../../context/GlobalStatus";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";

export default function Content() {
    const isFocused = useIsFocused();
    const {focusContent} = useGlobalContext();
    const [content, setContent] = useState({content: 'Fetching Content'});

    useEffect(() => {
        if (isFocused == true) {
          try {
            retrieveContentBody();
          } catch (error) {
            console.log(error);
          }
        }
    }, [isFocused])

    const retrieveContentBody = async () => {
        try{
            const contentRequestResult = await axios.get(`http://localhost:4000/api/education?mode=content&id=${focusContent}`);
            setContent(contentRequestResult.data.contentBody);
            return;
          } catch(error) {
            console.log(error);
          }
    }

    return(
        <View className='h-full bg-white'>
            <ScrollView className='h-full self-start ml-2'>
                <Text className='text-lg'>{content.content}</Text>
            </ScrollView>
        </View>
    )
}