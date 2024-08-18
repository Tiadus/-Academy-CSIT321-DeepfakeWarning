import {View, Text, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
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
        <SafeAreaView className='items-center h-full bg-background-primary'>
          <View className='flex flex-col w-10/12 h-full bg-background-primary'>
            <ScrollView className='h-full'>
                <Text className='text-lg text-text-primary'>{content.content}</Text>
            </ScrollView>
          </View>
        </SafeAreaView>
    )
}