import { API_URLS, getFormBody, LOCALSTORAGE_TOKEN_KEY } from '../utils/index';

const customFetch = async (url, { body, ...customConfig }) => {
  //LOCALSTORAGE_TOKEN_KEY is the key to getting the log-in token from local storage
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

  const headers = {
    //because our api server (codingninjas.codeial.com) accepts only form-urlencoded content
    'content-type': 'application/x-www-form-urlencoded',
  };

  if (token) {
    //if token exists in localStorage, then add it to the headers
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers, //if 'headers' object was also present inside customConfig, then key-values of ...customConfig.headers will be stored here(not outside)
    },
  };

  if (body) {
    //if body is present, then add it to the config as well
    //body is form body. We have to convert form body to urlencoded string
    config.body = getFormBody(body);
  }

  try {
    const response = await fetch(url, config); //the response recieved wud be a json string
    const data = await response.json(); //converting into js object

    if (data.success) {
      return {
        data: data.data,
        success: true,
      };
    }

    throw new Error(data.message); //if data.success was false
  } catch (error) {
    console.error('error');
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getPosts = (page = 1, limit = 5) => {
  return customFetch(API_URLS.posts(page, limit), {
    method: 'GET',
  });
};

export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    method: 'POST',
    body: { email, password },
  });
};

export const register = async (name, email, password, confirmPassword) => {
  return customFetch(API_URLS.signup(), {
    method: 'POST',
    body: { name, email, password, confirm_password: confirmPassword },
  });
};

export const editProfile = async (userId, name, password, confirmPassword) => {
  return customFetch(API_URLS.editUser(), {
    method: 'POST',
    body: { id: userId, name, password, confirm_password: confirmPassword },
  });
};

export const fetchUserProfile = (userId) => {
  return customFetch(API_URLS.userInfo(userId), {
    method: 'GET',
  });
};

export const fetchUserFriends = () => {
  return customFetch(API_URLS.friends(), {
    method: 'GET',
  });
};

export const addFriend = (userId) => {
  return customFetch(API_URLS.createFriendship(userId), {
    method: 'POST',
  });
};

export const removeFriend = (userId) => {
  return customFetch(API_URLS.removeFriend(userId), {
    method: 'POST',
  });
};

export const addPost = (content) => {
  return customFetch(API_URLS.createPost(), {
    method: 'POST',
    body: {
      content,
    },
  });
};

export const createComment = async (content, postId) => {
  return customFetch(API_URLS.comment(), {
    method: 'POST',
    body: {
      post_id: postId,
      content,
    },
  });
};

export const toggleLike = (itemId, itemType) => {
  return customFetch(API_URLS.toggleLike(itemId, itemType), {
    method: 'POST',
  });
};

export const searchUsers = (searchText) => {
  return customFetch(API_URLS.searchUsers(searchText), {
    method: 'GET',
  });
};
