import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

export const SettingsButton = ({icon, borderOption, buttonName, handleClick}) => {
    const className = "w-full relative flex flex-row items-center  space-x-2 p-2 " + borderOption;
    return (
        <TouchableOpacity 
            className={className}
            onPress={() => {handleClick()}}
        >
            <Ionicons name={icon} style={{ fontSize: 34 }}/> 
            <Text className="text-lg basis-4/5 ">{buttonName}</Text>
            <AntDesign name="right" size={20} color="black" className="basis-1/5"/>
        </TouchableOpacity>
    );
};