import { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert } from "react-native";

import { useGlobalContext } from "@/context/GlobalContext";
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

const SignUp = () => {
  const { register } = useGlobalContext();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateUsername = (username) => {
    return username.length > 0;
  };  

  const submit = async () => {
    let valid = true;

    if (!validateEmail(form.email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(form.password)) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!validateUsername(form.username)) {
      setUsernameError('Username cannot be empty');
      valid = false;
    } else {
      setUsernameError('');
    }

    if (!valid) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await register(form.username, form.email, form.password)
      if (result) {
        Alert.alert("Your account has been created. Please log in.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-3xl text-semibold font-psemibold">Sign Up</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            errorMessage={emailError}
          />
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            errorMessage={usernameError}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            errorMessage={passwordError}
            secureTextEntry
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular">Have an account already?</Text>
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