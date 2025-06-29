import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import ChatList from "../../components/ChatList/ChatList";

const DashboardLayout = () => {

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
