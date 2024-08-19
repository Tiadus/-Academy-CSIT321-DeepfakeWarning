import { Stack } from "expo-router";
import GlobalStatus from "../context/GlobalStatus";

export default function RootLayout() {
  return (
    <GlobalStatus>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="info" options={{ 
          title: "CONTACT INFORMATION", 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#000003', // Background Color
          },
          headerTintColor: '#F1F1F1', // Text Color
          headerTitleStyle: {
            fontWeight: '800', // Font Weight
          },
        }}/>
        <Stack.Screen name="incall" options={{ headerShown: false }}/>
      </Stack>
    </GlobalStatus>
  );
}
