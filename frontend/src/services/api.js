// import axios from 'axios';

// const API = axios.create({
//     // baseURL: 'http://localhost:3000/api', // Apna backend URL check karo

//     https://saas-billing-project-pj8p.vercel.app/api,
// });

// // Interceptor yahan ayega
// API.interceptors.request.use((req) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });

// export default API;



import axios from 'axios';

const API = axios.create({
    // Humne baseURL mein '/api/users' kar diya taakay tumhara frontend ka purana path match ho jaye
    baseURL: 'https://saas-billing-project-pj8p.vercel.app/api/users',
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