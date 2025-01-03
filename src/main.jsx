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
import ThankYouPage from './pages/ThankYouPage.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import RefundSuccessPage from './pages/RefundSuccessPage.jsx'
import AboutUs from './pages/AboutUs.jsx'
import ContactPage from './pages/ContactUs.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import AIConsultantList from './components/AIConsultantList.jsx'
import AIChat from './components/AIChat.jsx'


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
        path: "/about",
        element: <AboutUs/>,
      },
      {
        path: "/contact",
        element: <ContactPage/>,
      },
      {
        path: "/category/:category",
        element: <CategoryPage/>,
      },
      {
        path: "/ai",
        element: <AIConsultantList/>,
      },
      {
        path: "/profile",
        element: <UserProfilePage/>,
      },
    ],
  },
  {
    path: "/ai/:consultantCategory",
    element: <AIChat/>,
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
  {
    path: "/thanks",
    element: <ThankYouPage/>,
  },
  {
    path: "/error",
    element: <ErrorPage/>,
  },
  {
    path: "/refund/success",
    element: <RefundSuccessPage/>,
  },
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
