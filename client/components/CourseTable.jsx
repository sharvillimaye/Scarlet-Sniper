import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useGlobalContext } from '@/context/GlobalContext';

const CourseTable = ({ courses }) => {
  const { deleteCourse } = useGlobalContext();
  const [courseList, setCourseList] = useState(courses);

  const columns = useMemo(
    () => [
      { Header: 'Course', accessor: 'title' },
      { Header: 'Course Number', accessor: 'courseNumber' },
      { Header: 'Status', accessor: 'status' },
    ],
    []
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Course', 'Are you sure you want to unsubscribe from this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unsubscribe',
        onPress: () => {
          deleteCourse(id);
          setCourseList(courseList.filter((course) => course.id !== id));
        },
      },
    ]);
  };

  return (
    <View>
      {courseList.map((course) => (
        <View key={course.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <TouchableOpacity onPress={() => Linking.openURL(`https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92024&indexList=${course.courseNumber}`)}>
            <Text style={{ color: 'blue' }}>{course.title}</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 10 }}>{course.courseNumber}</Text>
          <Text style={{ marginHorizontal: 10 }}>{course.status}</Text>
          <TouchableOpacity onPress={() => handleDelete(course.courseNumber)}>
            <Text style={{ color: 'red' }}>Unsnipe</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CourseTable;