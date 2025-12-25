import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <StatusBar barStyle="light-content"  backgroundColor="#000"/>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
