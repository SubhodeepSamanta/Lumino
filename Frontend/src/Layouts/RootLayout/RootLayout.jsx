import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./RootLayout.css";
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  frontendApi={import.meta.env.VITE_CLERK_FRONTEND_API}
  proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}
  domain={import.meta.env.VITE_DOMAIN}
  afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/">
            <img src="/logo.png" alt="logo" />
            <span>Lumino</span>
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
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
