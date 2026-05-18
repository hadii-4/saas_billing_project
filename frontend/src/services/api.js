import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // Apna backend URL check karo
});

// Interceptor yahan ayega
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;