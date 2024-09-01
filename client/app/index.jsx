import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white" >
      <Text>Scarlet Sniper</Text>
      <StatusBar />
      <Link href="/home" style={{ color: 'blue' }}>Go to Home</Link>
    </View>
  );
}