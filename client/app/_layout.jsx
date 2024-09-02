import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";  

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "SUSE-Bold": require("../assets/fonts/SUSE-Bold.ttf"),
    "SUSE-ExtraBold": require("../assets/fonts/SUSE-ExtraBold.ttf"),
    "SUSE-ExtraLight": require("../assets/fonts/SUSE-ExtraLight.ttf"),
    "SUSE-Light": require("../assets/fonts/SUSE-Light.ttf"),
    "SUSE-Medium": require("../assets/fonts/SUSE-Medium.ttf"),
    "SUSE-Regular": require("../assets/fonts/SUSE-Regular.ttf"),
    "SUSE-SemiBold": require("../assets/fonts/SUSE-SemiBold.ttf"),
    "SUSE-Thin": require("../assets/fonts/SUSE-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack options={{headerShown: false}}>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='(auth)' options={{headerShown: false}}/>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
    </Stack>
  )
}

export default RootLayout