import axios from 'axios'
import { auth } from './firebase';

const apiRequest= axios.create({
    baseURL: import.meta.env.VITE_URL_ENDPOINT,
    withCredentials: true
})

// Attach Firebase ID token to all requests if user is logged in
apiRequest.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiRequest.interceptors.response.use(
    response=> response,
    error=>{
        if(error.response && error.response.status===401){
            window.location.href= '/sign-in';
        }
        return Promise.reject(error);
    }
)

export default apiRequest;