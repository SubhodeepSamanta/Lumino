import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./RootLayout.css";
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="rootLayout">
        <header>
          <Link to="/">
            <img src="logo.png" alt="logo" />
            <span>Lunimo</span>
          </Link>
          <div>
                <SignedIn>
                <UserButton />
                </SignedIn>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};

export default RootLayout;
