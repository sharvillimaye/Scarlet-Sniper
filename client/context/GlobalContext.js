import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [courses, setCourses] = useState([]);

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/register`, { username, email, password });
    } catch (e) {
      if (e.response?.status === 400) {
        Alert.alert("Error", 'Please enter a valid username and email!');
      } else {
        console.error(`Register error: ${e}`);
        Alert.alert("Error", 'Internal Server Error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      const userInfo = res.data;
      setUserInfo(userInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLogged(true);
      return true;
    } catch (e) {
      if (e.response?.status === 400) {
        Alert.alert("Error", 'Email or Password was incorrect.');
      } else {
        console.error(`Login error: ${e}`);
        Alert.alert("Error", 'Internal Server Error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsLogged(false);
    setCourses([]);
  };

  const isLoggedIn = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      if (userInfo) {
        setUserInfo(userInfo);
        setIsLogged(true);
        getCourses();
      }
    } catch (e) {
      console.error(`Is logged in error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const addCourse = async (courseNumber) => {
    if (courses && courses.length === 5) {
      Alert.alert("Error", "You can only snipe up to 5 courses.");
      return;
    }
    
    if (courseNumber !== null) {
      try {
        const response = await axios.post(`${BASE_URL}/subscriptions`, 
          { courseNumber: parseInt(courseNumber, 10) },
          { headers: { Authorization: userInfo.token } }
        );
        setCourses(prevCourses => [...prevCourses, response.data]);
        return true
      } catch (e) {
        console.error(`Error in adding course: ${e}`);
        Alert.alert("Error", "Failed to add course. Please try again.");
      }
    }
  };
  
  const deleteCourse = async (courseNumber) => {
    try {
      await axios.delete(`${BASE_URL}/subscriptions`, {
        headers: { Authorization: userInfo.token },
        data: { courseNumber }
      });
      setCourses(prevCourses => prevCourses.filter(course => course.courseNumber !== courseNumber));
    } catch (e) {
      console.error(`Error in deleting course: ${e}`);
      Alert.alert("Error", "Failed to delete course. Please try again.");
    }
  };
  
  const getCourses = async () => {
    try {
      if (userInfo) {
        const response = await axios.get(`${BASE_URL}/subscriptions`, {
          headers: { Authorization: userInfo.token }
        });
        setCourses(response.data);
      }
    } catch (e) {
      console.error(`Error in getting courses: ${e}`);
      Alert.alert("Error", "Failed to fetch courses. Please try again.");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        isLoading,
        isLogged,
        courses,
        addCourse,
        deleteCourse,
        getCourses,
        register,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;