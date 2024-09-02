import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const register = (username, email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/register`, {
        username,
        email,
        password,
      })
      .catch(e => {
        if (e.response.status === 400) {
          Alert.alert("Email or username already exists.");
        } else {
          Alert.alert("Registration attempt unsuccessful: Unknown network error");
        }
        console.log(`Register error: ${e}`);
        setIsLoading(false);
      });
  };

  const login = (email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/login`, {
        email,
        password,
      })
      .then(res => {
        const userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch(e => {
        if (e.response.status === 400) {
          Alert.alert("Email or Password was incorrect.");
        } else {
          Alert.alert("Log in attempt unsuccessful: Unknown network error");
        }
        console.log(`Login error: ${e}`);
        setIsLoading(false);
      });
  };

  const logout = () => {
    AsyncStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const isLoggedIn = async () => {
    try {
      setIsLogged(false);

      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(storedUserInfo);

      // AsyncStorage.removeItem('userInfo')

      if (userInfo) {
        console.log(userInfo)
        setUserInfo(userInfo);
        setIsLogged(true);
      }
    } catch (e) {
      setIsLogged(false);
      console.log(`Is logged in error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        isLoading,
        isLogged,
        setIsLogged,
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