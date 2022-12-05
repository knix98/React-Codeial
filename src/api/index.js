import { API_URLS, LOCALSTORAGE_TOKEN_KEY } from '../utils/index';

const customFetch = async (url, { body, ...customConfig }) => {
  //LOCALSTORAGE_TOKEN_KEY is the key to getting the log-in token from local storage
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
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
    config.body = JSON.stringify(body);
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