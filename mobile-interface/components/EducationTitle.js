import {View, Text, TouchableOpacity} from 'react-native';
import { router } from "expo-router";
import { useGlobalContext } from '../context/GlobalStatus';
import {LinearGradient} from 'expo-linear-gradient';

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
            <View className='flex items-center justify-center'>
                    <LinearGradient
                        className='items-center justify-center w-12 h-12 rounded-full p-2'
                        start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                        colors={['#0B5DFB', '#99008A']}
                    >
                        <Text className='text-lg font-bold text-text-primary'>{formatInteger(education.education_id)}</Text>
                    </LinearGradient>
            </View>
            <View className='ml-2 justify-center flex-1 overflow-hidden'>
                <Text numberOfLines={2} className='text-lg font-bold text-text-primary'>{education.title}</Text>
            </View>
        </TouchableOpacity>
    )
}