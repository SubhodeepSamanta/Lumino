import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import ChatList from "../../components/ChatList/ChatList";
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
        <ChatList/>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
