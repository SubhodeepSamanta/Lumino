import axios from 'axios'

const apiRequest= axios.create({
    baseURL: import.meta.env.VITE_URL_ENDPOINT,
    withCredentials: true
})

apiRequest.interceptors.response.use(
    response=> response,
    error=>{
        if(error.response.status===401){
            window.location.href= '/sign-in';
        }
        return Promise.reject(error);
    }
)

export default apiRequest;