import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./RootLayout.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FirebaseAuthProvider, useFirebaseAuth } from '../../Utils/FirebaseAuthContext';

const queryClient = new QueryClient()

function HeaderUserSection() {
  const { user, signOutUser } = useFirebaseAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);

  if (!user) return null;

  const avatarUrl = user.photoURL || '/public/avatar-default.png';
  const displayName = user.displayName || user.email || 'User';

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
  };

  return (
    <div
      className="profile-menu"
      onMouseEnter={() => setDropdown(true)}
      onMouseLeave={() => setDropdown(false)}
      tabIndex={0}
    >
      <img
        src={user.photoURL || "/logo.png"}
        alt="Profile"
        className="profile-avatar"
        title={displayName}
      />
      {dropdown && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <img
              src={user.photoURL || "/logo.png"}
              alt="Profile"
              className="profile-avatar-large"
            />
            <div className="profile-name">{displayName}</div>
          </div>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

const RootLayout = () => {
  return (
    <FirebaseAuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/">
              <img src="/logo.png" alt="logo" />
              <span>Lumino</span>
            </Link>
            <HeaderUserSection />
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </FirebaseAuthProvider>
  );
};

export default RootLayout;
