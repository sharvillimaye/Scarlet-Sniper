import { Image, View, Text, useWindowDimensions } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused, isLargeDevice }) => {
  return (
    <View className={`flex items-center justify-center ${isLargeDevice ? 'w-28' : 'w-16'}`}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{
          width: isLargeDevice ? 32 : 24,
          height: isLargeDevice ? 32 : 24
        }}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} ${isLargeDevice ? 'text-sm mt-2' : 'text-xs mt-1'}`}
        style={{ color: color }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { width, height } = useWindowDimensions();
  const isLargeDevice = width >= 768; // iPad mini width is 768px

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EF4852",
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          height: isLargeDevice ? '12%' : '10%',
          maxHeight: isLargeDevice ? 160 : 100,
          minHeight: 60,
          paddingBottom: isLargeDevice ? 30 : 10,
          paddingHorizontal: isLargeDevice ? 20 : 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
              isLargeDevice={isLargeDevice}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="add"
        options={{
          title: 'Add',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.add}
              color={color}
              name="Add"
              focused={focused}
              isLargeDevice={isLargeDevice}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.account}
              color={color}
              name="Account"
              focused={focused}
              isLargeDevice={isLargeDevice}
            />
          )
        }}
      />
    </Tabs>
  )
}

export default TabsLayout