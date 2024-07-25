import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

export default function Content() {
    return(
        <View className='h-full bg-white'>
        <ScrollView className='h-full self-start ml-2'>
            <Text>Content Page</Text>
        </ScrollView>
        </View>
    )
}