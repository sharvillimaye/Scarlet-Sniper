import { Image, View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
          tabBarShowLabel: false
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
            />
          )
        }}
      />
        
    </Tabs>
  )
}

export default TabsLayout