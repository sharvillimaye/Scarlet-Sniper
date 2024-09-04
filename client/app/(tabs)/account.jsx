import React from 'react'
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

const Account = () => {
  const { logout } = useGlobalContext() 
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => { 
    setSubmitting(true);
    try {
      await logout()
      router.replace("/");
    } catch(error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4 my-6'>
          <Text className='text-3xl text-semibold font-psemibold'>Account</Text>
          <CustomButton
            title="Log Out"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account