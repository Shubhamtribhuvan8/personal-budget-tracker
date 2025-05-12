import axios from "axios";
export const BASE_URL = 'http://localhost:8000/api'||'https://multifoldapi.onrender.com/api';
export const API = axios.create({ baseURL: BASE_URL });
