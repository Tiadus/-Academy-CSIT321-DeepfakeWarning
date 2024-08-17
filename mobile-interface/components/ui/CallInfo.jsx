import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from '../../context/GlobalStatus';
import { router } from "expo-router";

export default CallInfo = ({history}) => {
  const {setFocusContact} = useGlobalContext();

  const handleContactPress = async () => {
    setFocusContact(history);
    router.navigate('/info');
  }

  // 0 = Missed
  // 1 = Declined
  // 2 = Connected

  return (
    <TouchableOpacity 
      className="flex flex-row w-full h-[66px] space-x-2 p-2"
      onPress={handleContactPress}
    >
      <View className="justify-center h-full">
        <Image className="w-[36] h-[36] rounded-full"
          source={{uri: ('http://localhost:4000/' + history.avatar)}}
        />
      </View>
      <View className='border-b border-text-secondary flex-1 flex-row'>
        <View className="justify-center space-y-1 w-8/12">
          <Text className={history.call_status == '0' ? "text-text-danger" : "text-text-primary"}>{history.user_name}</Text>
            <View className="flex-row space-x-2">
              <View className="items-center justify-center">
                <MaterialCommunityIcons name={history.call_status == '0' ? "phone-missed" : "phone"} size={16} color="#767676"/>
              </View>
              <Text className="text-text-secondary">
                {history.call_status == '0' ? "Missed" : (history.call_status == '1' ? "Declined" : "Connected")}
              </Text>
            </View>
        </View>
        <View className="flex-row items-center justify-center gap-x-1">
          <Text className="text-text-secondary">{history.call_date}</Text>
          <Feather name="info" size={24} color="#767676" />
        </View>
      </View>
    </TouchableOpacity>
  );
};