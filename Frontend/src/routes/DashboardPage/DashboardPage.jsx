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
      <form>
        <input type="text" placeholder='Ask me anything'/>
        <button type='submit'>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  )
}

export default DashboardPage