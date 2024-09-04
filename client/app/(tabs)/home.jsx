import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useGlobalContext } from '@/context/GlobalContext';
import CourseTable from '@/components/CourseTable';

const Home = () => {
  const { getCourses, courses } = useGlobalContext();

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className='w-full px-4 my-6'>
          <Text className='text-3xl font-psemibold mt-6'>Home</Text>
          <CourseTable courses={courses} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;