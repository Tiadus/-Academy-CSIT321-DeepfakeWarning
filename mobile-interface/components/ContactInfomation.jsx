import {View, Text, TouchableOpacity} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from '../context/GlobalStatus';

export default function ContactInformation({contact}) {
    const {setFocusContact} = useGlobalContext();

    const handleContactPress = async () => {
        setFocusContact(contact);
        router.navigate('/info');
    }

    return (
        <TouchableOpacity
            className='flex-row mb-4 border-b pb-2 border-gray-200'
            onPress={handleContactPress}
        >
            <View className='border border-solid border-black rounded-full p-1'>
                <Text className='text-md'>{contact.initial}</Text>
            </View>
            <View className='ml-2'>
                <Text className='text-lg'>{contact.name}</Text>
            </View>
        </TouchableOpacity>
    )
}