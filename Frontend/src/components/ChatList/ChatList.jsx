import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../Utils/apiRequest";

const ChatList = () => {

    const handleChatsFetch= async()=>{
        const response= await apiRequest.get('/api/userchats');
        return response.data;
    }

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: handleChatsFetch
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
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
    </>
  );
};

export default ChatList;
