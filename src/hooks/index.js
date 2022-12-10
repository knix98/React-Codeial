import { useContext, useState, useEffect } from 'react';
import jwt from 'jwt-decode';

import { AuthContext, PostsContext } from '../providers';
import {
  editProfile,
  login as userLogin,
  register,
  fetchUserFriends,
  getPosts,
} from '../api/index';
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
    const getUser = async () => {
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

      if (userToken) {
        const user = jwt(userToken);

        //the user decoded from the jwt only contains user-name & user-email data only
        //so we need to add user-friends also to the user object decoded from the jwt above
        const response = await fetchUserFriends();

        let friends = [];

        if (response.success) {
          friends = response.data.friends;
        }

        //adding the friends array to the user object, and setting as user-state
        setUser({
          ...user,
          friends,
        });
      }

      setLoading(false);
    };

    getUser();
  }, []);

  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);

    if (response.success) {
      //set the state of user as the new user recieved in response
      setUser(response.data.user);

      //now change the jwt stored in local storage with the new jwt recieved(new jwt acc. to new user) in response
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

  const signup = async (name, email, password, confirmPassword) => {
    const response = await register(name, email, password, confirmPassword);

    if (response.success) {
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

  //function to add/remove a friend from user.friends array, depending upon
  //whether 'addFriend' passed as argument is true/false
  const updateUserFriends = (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        //a 'friend' inside 'friends' array contains from_user: auth.user, to_user: 1 of the friends of auth.user
        friends: [...user.friends, friend],
      });
      return;
    }

    //create a new friends array, excluding the friend to be removed
    const newFriends = user.friends.filter(
      (f) => f.to_user._id !== friend.to_user._id
    );

    setUser({
      ...user,
      friends: newFriends,
    });
    return;
  };

  return {
    user,
    login,
    logout,
    loading,
    signup,
    updateUser,
    updateUserFriends,
  };
};

export const usePosts = () => {
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const addPostToState = (post) => {
    //add the newly created post to the top of the posts list
    const newPosts = [post, ...posts];

    setPosts(newPosts);
  };

  return {
    data: posts,
    loading,
    addPostToState,
  };
};
