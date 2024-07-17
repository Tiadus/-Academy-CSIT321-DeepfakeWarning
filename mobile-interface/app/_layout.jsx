import { Stack } from "expo-router";
import GlobalStatus from "../context/GlobalStatus";

export default function RootLayout() {
  return (
    <GlobalStatus>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="incall" options={{ headerShown: false }}/>
      </Stack>
    </GlobalStatus>
  );
}
