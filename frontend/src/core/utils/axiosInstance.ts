import axios from "axios"

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_API_URL : window.location.origin });

export default axiosInstance;
