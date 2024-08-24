import {View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert, Animated} from 'react-native';
import { useState, useEffect, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from 'react-native-document-picker';
import { useGlobalContext } from "../../context/GlobalStatus";
import axios from 'axios';

export default function Upload() {
    const {user} = useGlobalContext();
    const isFocused = useIsFocused();
    const [analyseMode, setAnalyseMode] = useState(false);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const uploadColorSet = ['#8AE3FF', '#8AE3FF', '#8AE3FF', '#1A5AFF', '#1A5AFF', '#AEA7FF', '#AEA7FF', '#9C3AFF'];
    const detectColorSet = ['#BD8AFF', '#BD8AFF', '#BD8AFF', '#99008A', '#99008A', '#FFA7F1', '#FFA7F1', '#FF3ADF'];
    const safeColorSet = ['#096B00', '#11D100'];
    const dangerColorSet = ['#790000', '#A50000'];

    useEffect(() => {
        if (isFocused == true) {
            setFile(null);
            setResult(null);
            setAnalyseMode(false);
        }
    }, [isFocused])

    const handleReset = async () => {
        setFile(null);
        setResult(null);
        setAnalyseMode(false);
    }

    const handleFileUploaded = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const file = result[0];
            setFile(file);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                // User canceled the picker
                console.log('User canceled the picker');
            } else {
                console.log(error)
            }
        }
    }

    const handleFileDetect = async () => {
        try {
            if (!file) {
                Alert.alert(
                    'Warning',
                    'Please Select A File',
                    [
                        {text: 'OK'}
                    ],
                    { cancelable: false }
                );
                return;
            }

            const fileType = file.type || file.mimeType;

            // Check if the file is of type FLAC
            if (fileType !== 'audio/flac') {
                Alert.alert(
                    'Warning',
                    'Please Only Select Files With Type Flac',
                    [
                        {text: 'OK'}
                    ],
                    { cancelable: false }
                );
                return;
            }

            setAnalyseMode(true);

            const formData = new FormData();
            formData.append('file', {
              uri: file.uri,
              type: file.type,
              name: user.user_id + '-' + file.name,
            });

            const response = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data.message);
        } catch (error) {
            console.log(error);
            handleFileDetect()
            /*console.log(error);
            Alert.alert(
                'Network Error',
                'There has been an error in detecting. Please try again!',
                [
                    {text: 'OK', onPress: () => {handleReset();}}
                ],
                { cancelable: true }
            );*/
        }
    }

    const handleFile = async () => {
        try {
            if (!file) {
                handleFileUploaded();
            } else if (file) {
                handleFileDetect();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const FadeInRotateView = props => {
        const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
        const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0
      
        useEffect(() => {
            // Loop the fade animation
            Animated.loop(
              Animated.sequence([
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
                }),
              ])
            ).start();
        }, [fadeAnim]);
        
        useEffect(() => {
        // Loop the rotate animation
        Animated.loop(
            Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            })
        ).start();
        }, [rotateAnim]);
      
        const rotateInterpolation = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });
      
        return (
          <Animated.View // Special animatable View
            style={{
              ...props.style,
              opacity: fadeAnim, // Bind opacity to animated value
              transform: [{ rotate: rotateInterpolation }]
            }}>
            {props.children}
          </Animated.View>
        );
      };

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='flex h-full w-11/12 bg-background-primary'>
                {analyseMode === false && <View className='h-full w-full'>
                    <View className='flex-row mt-20 mb-10'>
                        <View className='w-1/2'>
                            <Text className='font-extrabold text-4xl text-text-primary'>
                                UPLOAD
                            </Text>
                        </View>
                        {file !== null &&
                            <View className='flex w-1/2'>
                                <TouchableOpacity onPress={handleReset} className='self-end flex-1 items-center justify-center w-1/4 rounded-lg bg-[#811F00]'>
                                    <Ionicons name='refresh' style={{ fontSize: 35, color: "#F1F1F1" }}/> 
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View className='flex-1 flex-col items-center justify-center w-full gap-y-10'>
                        <TouchableOpacity onPress={handleFile}>
                            <LinearGradient
                                className='items-center justify-center w-[200px] h-[200px] rounded-full p-2'
                                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                                colors={file === null ? uploadColorSet : detectColorSet}
                            >
                                <View className='items-center justify-center w-[175px] h-[175px] rounded-full bg-background-secondary'>
                                    <View className='flex-1 items-center justify-center'>
                                        <Text className='font-bold text-[30px] text-text-primary'>
                                            {file === null ? 'UPLOAD' : 'DETECT'}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text className={'font-bold text-2xl ' + (file === null ? 'text-text-primary' : 'text-[#02F0FF]')}>
                            {file !== null ? file.name : 'Please Choose A File'}
                        </Text>
                    </View>
                </View>}
                {analyseMode === true && <View className='flex w-full h-full items-center justify-center'>
                    {result === null && <View classname="relative w-[200px] h-[200px] bg-app-primary">
                        <FadeInRotateView classname="relative">
                            <LinearGradient
                                className='items-center justify-center w-[200px] h-[200px] rounded-full p-2'
                                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                                colors={['#0B5DFB', '#99008A']}
                            >
                            </LinearGradient>
                        </FadeInRotateView>
                        <View 
                            className='items-center justify-center w-[200px] h-[200px] rounded-full absolute'
                            //style={{opacity: fadeAnim}}
                        >
                            <View className='items-center justify-center w-[175px] h-[175px] rounded-full bg-background-secondary'>
                                <Text className='font-bold text-[30px] text-text-primary'>LOADING</Text>
                            </View>
                        </View>
                    </View>}
                    {result !== null && <View className='flex items-center justify-center gap-y-10 w-full'>
                        <LinearGradient
                                className='items-center justify-center w-[200px] h-[200px] rounded-full p-2'
                                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                                colors={result ? (result === 'Safe' ? safeColorSet : dangerColorSet) : safeColorSet}
                            >
                                <View className='items-center justify-center w-[175px] h-[175px] rounded-full bg-background-secondary'>
                                    <View className='flex-1 items-center justify-center'>
                                        <Text className='font-bold text-[30px] text-text-primary'>
                                            {result ? (result === 'Safe' ? 'Safe' : 'Deepfake') : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                        </LinearGradient>
                        <Text className='font-bold text-2xl text-text-primary'>
                            {result ? (result === 'Safe' ? 'No Deepfake Detected' : 'Deepfake Detected') : 'N/A'}
                        </Text>
                        <TouchableOpacity onPress={handleReset} className="items-center justify-center w-full h-12 rounded-xl bg-button-primary">
                            <Text className="text-text-primary">RETURN</Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>
        </SafeAreaView>
    );
}