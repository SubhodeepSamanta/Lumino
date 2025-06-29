import React from 'react'
import { Link } from 'react-router-dom'

const ChatList = () => {
  return (
    <>
    <span className="title">DASHBOARD</span>
        <Link to="/">Create a new Chat</Link>
        <Link to="/">Explore Lumino AI</Link>
        <Link to="/">Contact</Link>
        <hr />
        <span className="title">RECENT CHATS</span>
        <div className="recent">
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
        <Link to="/">New Chat</Link>
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
  )
}

export default ChatList