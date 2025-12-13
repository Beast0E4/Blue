import axios from 'axios';
import type { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT)
});

export default axiosInstance;
