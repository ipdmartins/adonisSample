import axios from 'axios';

//axios serve para integrar o frontend com backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:3333',
})

export default api;