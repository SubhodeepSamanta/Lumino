import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import apiRequest from "../../Utils/apiRequest";
import { useQuery } from "@tanstack/react-query";

const DashboardLayout = () => {

  const getUserChats= async()=>{
    const response= await apiRequest.get('/api/userchats');
    return response.data;
  }
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => getUserChats(),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  if(data) console.log(data);

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <span className="title">DASHBOARD</span>
        <Link to="/dashboard">Create a new Chat</Link>
        <Link to="/">Explore Lumino AI</Link>
        <Link to="/">Contact</Link>
        <hr />
        <span className="title">RECENT CHATS</span>
        <div className="recent">
          {data?.map((chat)=>(
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
          ))}

        </div>
        <hr />
        <div className="upgrade">
          <img src="/logo.png" alt="logo" />
          <span>
            Upgrade to Lumino AI Pro
            <div>Get Unlimited access to all features</div>
          </span>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
