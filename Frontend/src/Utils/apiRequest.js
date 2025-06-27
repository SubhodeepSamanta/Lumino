import axios from 'axios'

const apiRequest= axios.create({
    baseURL: import.meta.env.VITE_URL_ENDPOINT,
    withCredentials: true
})

export default apiRequest;