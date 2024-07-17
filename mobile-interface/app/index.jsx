import { Text, View } from "react-native";
import { router } from "expo-router";
import { TouchableOpacity, Button } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title='Enter' onPress={() => {
        router.push('/sign-in')
      }}/>
    </View>
  );
}
