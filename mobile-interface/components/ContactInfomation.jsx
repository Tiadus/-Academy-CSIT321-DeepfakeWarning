import {View, Text, TouchableOpacity, Image} from 'react-native';
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
            className='flex-row mb-5 border-b border-app-secondary pb-2'
            onPress={handleContactPress}
        >
            <View className="justify-center">
                <Image className="w-[36] h-[36] rounded-full"
                source={{uri: ('http://localhost:4000/' + contact.avatar)}}
                />
            </View>
            <View className='ml-2'>
                <Text className='text-2xl text-text-primary'>{contact.user_name}</Text>
            </View>
        </TouchableOpacity>
    )
}