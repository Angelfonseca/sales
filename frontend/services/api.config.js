import axios from 'axios';

const url = 'http://localhost:3000/';
//  const url = 'https://zhbfc0w5-3000.usw3.devtunnels.ms/';
const api = axios.create({
    baseURL: `${url}api`
});

api.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export { api, url }; 
