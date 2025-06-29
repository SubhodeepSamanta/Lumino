import axios from 'axios'

const apiRequest= axios.create({
    baseURL:"http://localhost:5600",
    withCredentials: true
})

export default apiRequest;