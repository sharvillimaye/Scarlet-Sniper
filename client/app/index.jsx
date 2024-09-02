import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants";
import CustomButton from "../components/CustomButton"

export default function Index() {
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
            containerStyles="w-full mt-7"
          />
          
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="dark"></StatusBar>
    </SafeAreaView>
  );
}