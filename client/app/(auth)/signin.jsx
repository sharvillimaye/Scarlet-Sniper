import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

const SignIn = () => {
  const { login, userInfo } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      if (await login(form.email, form.password)) {
        router.replace("/home");
      }
    } catch (error) {
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
          <Text className='text-3xl text-semibold mt-10 font-psemibold'> Log in</Text>
          <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg font-pregular">
                Don't have an account?
              </Text>
              <Link href="/signup" className="text-lg font-psemibold text-primary">
                Sign up
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

export default SignIn