import { useContext, useState, useEffect } from 'react';
import jwt from 'jwt-decode';

import { AuthContext } from '../providers/AuthProvider';
import { login as userLogin } from '../api/index';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  getItemFromLocalStorage,
} from '../utils';

//custom hook for useContext
export const useAuth = () => {
  //the initial value for useContext wud be AuthContext that was made inside '../providers/AuthProvider'
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //this 'loading' state is for the first time only whenever AuthProvider component mounts
  //and wud always remain false after the useEffect does its job after the first monuting(see below, useEffect sets loading to false)

  useEffect(() => {
    const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

    if (userToken) {
      const user = jwt(userToken);

      setUser(user);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await userLogin(email, password);

    if (response.success) {
      setUser(response.data.user);

      //save the JWT recieved in local storage
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    //remove JWT from local storage when user logs out
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

    setUser(null);
  };

  return {
    user,
    login,
    logout,
    loading,
  };
};
