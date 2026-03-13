import axios from 'axios';

const API = axios.create({
  baseURL: 'https://codveda-backend-ddvm.onrender.com/api'
});

//Automatically attach token to every request
API.interceptors.request.use((conf) => {
  const token = localStorage.getItem('token');
  if(token) {
    conf.headers.Authorization = `Bearer ${token}`;
  }
  return conf;
});

//Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

//User
export const getUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const createUser = (userData) => API.post('/users', userData);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);

//Post
export const getPosts = () => API.get('/posts');
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getMyPosts = () => API.get('/posts/user/myposts');