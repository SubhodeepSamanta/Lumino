import React, { useEffect } from 'react'
import './DashboardPage.css'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../Utils/apiRequest';

const DashboardPage = () => {
    const { userId, isLoaded}= useAuth();
    const navigate= useNavigate();
    useEffect(()=>{
        if(isLoaded && !userId){
            navigate('/sign-in');
        }
    },[userId,isLoaded,navigate]);

    if(!isLoaded) return "Loading...";

    const handleSubmit= async(e)=>{
      e.preventDefault();
      const text= e.target.text.value;
      const response= await apiRequest.post("/api/chats",{ text});
      console.log(response);
    }

  return (
    <div className='dashboardPage'>
      <div className="text">
        <div className="text-logo">
          <img src="/logo.png" alt="logo" />
          <h1>LUMINO AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="chat" />
            <span>Create a new Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="chat" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="chat" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <input type="text" name='text' placeholder='Ask me anything' autoComplete='off'/>
        <button type='submit'>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  )
}

export default DashboardPage