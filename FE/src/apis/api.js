import axios from "axios";
export const BASE_URL = 'https://personal-budget-tracker-8d77.onrender.com/api';
export const API = axios.create({ baseURL: BASE_URL });
