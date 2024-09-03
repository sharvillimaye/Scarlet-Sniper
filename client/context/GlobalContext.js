import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/register`, { username, email, password });
    } catch (e) {
      if (e.response?.status === 400) {
        Alert.alert("Error", 'Please enter a valid username and email!');
      } else {
        console.log(`Register error: ${e}`);
        throw new Error('Internal Server Error.');
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
        console.log(`Login error: ${e}`);
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
  };

  const isLoggedIn = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      if (userInfo) {
        setUserInfo(userInfo);
        setIsLogged(true);
      }
    } catch (e) {
      console.log(`Is logged in error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const addCourse = async (courseNumber) => {
    courseNumber = parseInt(courseNumber, 10);
    try {
      const response = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${userInfo.token}`,
        },
        body: JSON.stringify({ courseNumber }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.log(`Error in adding courses: ${e}`);
    }
  };
  
  const deleteCourse = async (courseNumber) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", userInfo.token);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "courseNumber": courseNumber
    });

    console.log(courseNumber)

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/api/v1/subscriptions", requestOptions)
      .then((response) => response.json)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  
  const getCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'GET',
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(`Error in getting courses: ${e}`);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        isLoading,
        isLogged,
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