import React, { useEffect } from 'react'
import './DashboardPage.css'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { userId, isLoaded}= useAuth();
    const navigate= useNavigate();
    useEffect(()=>{
        if(isLoaded && !userId){
            navigate('/sign-in');
        }
    },[userId,isLoaded,navigate]);

    if(!isLoaded) return "Loading...";

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage