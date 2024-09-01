import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants";

export default function Index() {
  return (
    <View className="items-center justify-center">
      <Text>Hey</Text>
      <Link href={"/(tabs)/home"}>Click Here</Link>
    </View>
  );
}