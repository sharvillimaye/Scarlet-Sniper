import { useState, useEffect, useRef } from 'react';
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Button, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function Index() {  
  const { isLoading, isLogged } = useGlobalContext();
  const { expoPushToken, notification } = usePushNotifications()
  const data = JSON.stringify(notification, undefined, 2)
  
  if (!isLoading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="white">
      <ScrollView contentContainerStyle={{height: '100%',}}>
        <View className="w-full flex justify-center items-center h-full px-4">
          <Text className="text-5xl text-primary font-pbold text-center">
            Scarlet Sniper
          </Text>
          <CustomButton 
            title="Continue with Email"
            handlePress={() => router.push('/signin')}
            containerStyles="w-full mt-7" textStyles={undefined} isLoading={undefined}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
}