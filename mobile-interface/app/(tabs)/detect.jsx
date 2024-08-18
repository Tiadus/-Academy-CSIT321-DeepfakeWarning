import { ScrollView, View, Image, SafeAreaView, Text, Button } from "react-native";
import { useState } from "react";

export default function Upload() {
    const [isUploaded, setIsUpload] = useState(false);
    const [isDetected, setIsDetected] = useState(false);

    return (
        <SafeAreaView className='items-center h-full bg-background-primary'>
            <View className='h-full w-11/12 bg-background-primary'>
                <View className='flex-col mt-20 mb-10'>
                    <Text className='font-extrabold text-4xl text-text-primary'>DETECT</Text>
                </View>
            </View>
            {/*<View className="w-full flex p-4 pt-8 gap-4 mt-8">
                <Text className="text-4xl font-bold">Detect</Text>
                <View className='items-center justify-center mb-4 w-full overflow-hidden rounded-md'>
                    <Image
                        source={images.ai}
                        className="w-full h-[200px]"
                    />
                </View>
                <Text className="text-2xl">Upload audio file</Text>
                <View className="bg-[#CDCDCD] rounded-md items-center gap-y-4 px-3 w-full">
                <View className="border-dashed bg-[#F4F4F4] border-2 border-slate-400 rounded-md items-center justify-center w-full">
                    <View className="mt-4">
                    <FontAwesome name="file-sound-o" size={48} color="gray" />
                    </View>
                    {isUploaded? 
                    <Text className="text-lg text-slate-500 p-2 ">Filed uploaded</Text>:
                    
                    <Text className="text-lg text-slate-500 p-2 ">
                    Browse files on device
                    </Text>
                    }
                </View>
                    {isDetected?
                    <View className="relative flex w-full items-center">
                        <Text className=" absolute left-0 text-3xl font-bold">Result</Text>
                        <View className="border-4 border-red-400 rounded-full w-[120px] h-[120px] items-center justify-center mt-8">
                            <Text className="text-2xl font-extrabold text-red-500">75%</Text>
                            <Text className="text-xl font-extrabold text-red-500">Deepfake</Text>
                        </View>
                    </View>
                    :<></>}
                <View className="flex flex-row gap-x-4  ">
                <Button
                    onPress={() => {
                        setIsUpload(!isUploaded);
                        setIsDetected(false)
                    }}
                    mode="contained"
                    className="bg-[#353535] rounded-3xl w-1/3 mb-2"
                    >
                    Upload
                </Button>
                {isUploaded? 
                <Button 
                onPress={()=>{
                    setIsDetected(!isDetected)
                    setIsUpload(false)
                }}
                mode="contained" 
                className="rounded-3xl w-1/3 mb-2">Detect</Button>
                : <></>
                }
                    </View>
                </View>
            </View>*/}
        </SafeAreaView>
    );
}