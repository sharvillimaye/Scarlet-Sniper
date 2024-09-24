import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, ScrollView, SafeAreaView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalContext';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

const TableHeader = ({ title, width, align = 'left' }) => (
  <StyledView className={`${width} px-2 flex justify-center`}>
    <StyledText className={`text-sm font-pbold text-white ${align === 'center' ? 'text-center' : ''}`}>{title}</StyledText>
  </StyledView>
);

const TableCell = ({ children, width, align = 'left' }) => (
  <StyledView className={`${width} px-2 flex justify-center items-${align}`}>
    <StyledText className={`text-sm ${align === 'center' ? 'text-center' : ''}`}>{children}</StyledText>
  </StyledView>
);

const CourseTable = () => {
  const { deleteCourse, getCourses, courses } = useGlobalContext();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();

  const isLargeDevice = width >= 768; // iPad mini width is 768px

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      await getCourses();
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  const handleDelete = (courseNumber) => {
    Alert.alert('Unsnipe Course', 'Are you sure you want to unsnipe this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsnipe',
        onPress: () => {
          deleteCourse(courseNumber);
        },
      },
    ]);
  };

  const toggleCourseView = () => {
    setShowAllCourses(!showAllCourses);
  };

  const filteredCourses = courses ? (showAllCourses ? courses : courses.filter(course => course.status === 'OPEN')) : [];

  if (isLoading) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </StyledView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <StyledView className="px-2 py-4">
          {courses && courses.length > 0 ? (
            <>
              <StyledText className="text-black font-pmedium text-xl mb-4 text-center">
                {showAllCourses ? "All Courses" : "Open Courses"}
              </StyledText>
              <StyledView className="flex-row bg-primary rounded-t-lg py-3">
                <TableHeader title="Title" width={isLargeDevice ? "w-3/5" : "w-1/2"} align="left" />
                <TableHeader title="Index" width={isLargeDevice ? "w-1/5" : "w-1/4"} align="center" />
                <TableHeader title="Action" width={isLargeDevice ? "w-1/5" : "w-1/4"} align="center" />
              </StyledView>
              {filteredCourses.map((course, index) => (
                <StyledView 
                  key={course.courseNumber} 
                  className={`flex-row border-b border-gray-200 py-3 ${
                    index === courses.length - 1 ? 'rounded-b-lg' : ''
                  } ${index % 2 === 0 ? 'bg-white' : 'bg-red-50'}`}
                >
                  <TableCell width={isLargeDevice ? "w-3/5" : "w-1/2"} align="left">
                    <StyledTouchableOpacity onPress={() => Linking.openURL(`https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92024&indexList=${course.courseNumber}`)}>
                      <StyledText className="text-blue-500 font-pmedium">{course.title}</StyledText>
                    </StyledTouchableOpacity>
                  </TableCell>
                  <TableCell width={isLargeDevice ? "w-1/5" : "w-1/4"} align="center">
                    {course.courseNumber}
                  </TableCell>
                  <TableCell width={isLargeDevice ? "w-1/5" : "w-1/4"} align="center">
                    <StyledTouchableOpacity 
                      onPress={() => handleDelete(course.courseNumber)}
                      className={`bg-red-500 py-1 px-1 rounded-full ${isLargeDevice ? 'w-24' : 'w-16'}`}
                    >
                      <StyledText className="text-white font-pmedium text-center text-sm">Unsnipe</StyledText>
                    </StyledTouchableOpacity>
                  </TableCell>
                </StyledView>
              ))}
            </>
          ) : (
            <StyledView className="items-center">
              <StyledText className='text-center font-psemibold pt-2 mt-7'>No courses currently sniped.</StyledText>
              <Link href="/add" asChild>
                <StyledTouchableOpacity className="mt-2">
                  <StyledText className="text-lg font-psemibold text-primary">Snipe Courses</StyledText>
                </StyledTouchableOpacity>
              </Link>
            </StyledView>
          )}
        </StyledView>
        {courses && courses.length > 0 && (
          <StyledTouchableOpacity onPress={toggleCourseView} className="bg-blue-500 py-2 px-4 rounded-full mx-4 my-2">
            <StyledText className="text-white font-pmedium text-center">
              {showAllCourses ? "Show Open Courses" : "Show All Sniped Courses"}
            </StyledText>
          </StyledTouchableOpacity>
        )}
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default CourseTable;