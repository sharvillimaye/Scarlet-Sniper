import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';

import { useGlobalContext } from '@/context/GlobalContext';
import CourseTable from '@/components/CourseTable';

const Home = () => {
  const { getCourses, userInfo } = useGlobalContext();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getCourses();
      if (data !== null) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-3xl text-semibold font-psemibold">Courses</Text>
          {courses && courses.length === 0 ? <Text>No Courses Available</Text> : <CourseTable courses={courses} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;