import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import ConsultantProfilePage from './pages/UserProfilePage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Registration.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import ConsultationRoom from './pages/ConsultationRoom.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path: "/profile",
        element: <UserProfilePage/>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Register/>,
  },
  {
    path: "/chat",
    element: <ChatWindow/>,
  },
  {
    path: "/room/:id",
    element: <ConsultationRoom/>,
  },
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
