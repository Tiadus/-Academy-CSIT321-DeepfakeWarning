import {View, Text, TouchableOpacity} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from '../context/GlobalStatus';

export default function EducationTitle({education}) {
    const {setFocusContent} = useGlobalContext();

    const handleContactPress = async () => {
        setFocusContent(education.education_id);
        router.navigate('/content');
    }

    const formatInteger = (n) => {
        if (parseInt(n) < 10) {
            return '0' + n.toString();
        } else {
            return n.toString();
        }
    };

    return (
        <TouchableOpacity
                className='flex-row mb-6'
                onPress={() => {
                    handleContactPress();
                }}
            >
            <View className='border border-solid border-black rounded-full h-12 w-12 p-1 items-center justify-center bg-blue-50'>
                <Text className='text-lg font-bold'>{formatInteger(education.education_id)}</Text>
            </View>
            <View className='ml-2 justify-center flex-1 overflow-hidden'>
                <Text numberOfLines={2} className='text-lg font-bold'>{education.title}</Text>
            </View>
        </TouchableOpacity>
    )
}