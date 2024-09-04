import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

const AuthLayout = () => {
  return (
   <>
    <Stack options={{
      headerShown: false
    }}>
      <Stack.Screen 
        name="signin"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="signup"
        options={{
          headerShown: false
        }}
      />
    </Stack>
    <StatusBar backgroundColor="#161622" style="dark"></StatusBar>
   </>
  )
}

export default AuthLayout