import React from 'react'
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

const Add = () => {
  const { addCourse } = useGlobalContext() 
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    courseNumber: '',
  })


  const submit = async () => {
    if (form.courseNumber === "") {
      Alert.alert("Error", "Please add course number");
    }

    setSubmitting(true);

    try {
      const result = await addCourse(form.courseNumber)
      if (result) {
        Alert.alert("Course successfully added!")
      }
    } catch(error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View 
          className='w-full flex justify-center h-full px-4 my-6'
        >
          <Text className='text-3xl text-semibold font-psemibold'>Add Sections</Text>
          <FormField
            title="Course Number"
            value={form.courseNumber}
            handleChangeText={(e) => setForm({ ...form, courseNumber: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Snipe"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Add