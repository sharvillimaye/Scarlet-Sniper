import { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

const SignUp = () => {
  const { register } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await register(form.username, form.email, form.password)
      Alert.alert("Your account has been created. Please log in.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='flex'>
      <ScrollView className="flex grow">
        <View 
          className='w-full flex justify-center h-full px-4'
        >
          <Text className='text-3xl text-semibold mt-10 font-psemibold'> Sign up</Text>
          <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7"
            />
          
          <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-5"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-5"
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg font-pregular">
                Have an account already?
              </Text>
              <Link href="/signin" className="text-lg font-psemibold text-primary">
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

export default SignUp