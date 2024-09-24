import React from 'react'
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

const Account = () => {
  const { logout, deleteAccount } = useGlobalContext() 
  const [isSubmitting, setSubmitting] = useState(false);

  const submitLogOut = async () => { 
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

  const submitDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          onPress: async () => {
            setSubmitting(true);
            try {
              const result = await deleteAccount()
              if (result && result === true) {
                router.replace("/");
              }
            } catch(error) {
              Alert.alert("Error", error.message);
            } finally {
              setSubmitting(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  }

  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4 my-6'>
          <Text className='text-3xl text-semibold font-psemibold'>Account</Text>
          <CustomButton
            title="Log Out"
            handlePress={submitLogOut}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Delete Account"
            handlePress={submitDeleteAccount}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account