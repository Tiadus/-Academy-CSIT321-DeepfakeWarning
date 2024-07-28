import { View, TouchableOpacity } from "react-native";
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

  return (
    <TouchableOpacity 
      className="w-full flex flex-row space-x-2 p-2"
      onPress={handleContactPress}
    >
      <MaterialCommunityIcons
        name="account-circle-outline"
        size={36}
        color="gray"
        className="basis-1/10"
      />
      <View className='border-b border-slate-400 flex-1 flex-row'>
        <View className="justify-center space-y-1 w-8/12">
          {history.call_status == '0' && <Text className="text-red-500">{history.user_name}</Text>}
          {history.call_status == '1' && <Text className="text-red-500">{history.user_name}</Text>}
          {history.call_status == '2' && <Text className="text-green-500">{history.user_name}</Text>}
          {history.call_status == '0' &&
            <View className="flex-row space-x-2">
              <Feather name="phone-missed" size={16} color="gray" />
              <Text className="text-slate-700">{'Missed'}</Text>
            </View>
          }
          {history.call_status == '1' &&
            <View className="flex-row space-x-2">
              <Feather name="phone-missed" size={16} color="gray" />
              <Text className="text-slate-700">{'Rejected'}</Text>
            </View>
          }
          {history.call_status == '2' &&
            <View className="flex-row space-x-2">
              <Feather name="phone-call" size={16} color="gray" />
              <Text className="text-slate-700">{'Connected'}</Text>
            </View>
          }
        </View>
        <View className="flex-row items-center justify-center">
          <Text className="text-slate-700">{history.call_date}</Text>
          <Feather name="info" size={24} color="gray" />
        </View>
      </View>
    </TouchableOpacity>
  );
};