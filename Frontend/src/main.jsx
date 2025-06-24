import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from './Layouts/RootLayout/RootLayout';
import HomePage from './routes/HomePage/HomePage';
import DashboardLayout from './Layouts/DashboardLayout/DashboardLayout';
import DashboardPage from './routes/DashboardPage/DashboardPage';
import ChatPage from './routes/ChatPage/ChatPage';

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        path:'/',
        element: <HomePage/>
      },
      {
        element: <DashboardLayout/>,
        children:[
          {
            path:'/dashboard',
            element: <DashboardPage/>
          },
          {
            path: '/dashboard/chats/:id',
            element: <ChatPage/>
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
