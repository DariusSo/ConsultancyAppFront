import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TopHeader from './components/TopHeader'
import Login from './pages/Login'
import Register from './pages/Registration'
import HeroSection from './components/HeroSection'
import Banner from './components/Banner'
import SearchBar from './components/SearchBar'
import ConsultantCard from './components/ConsultantInfoRow'
import HomePage from './pages/HomePage'
import ConsultantProfilePage from './pages/UserProfilePage'
import { Outlet } from 'react-router-dom'
import MainNavbar from './components/MainNavbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopHeader/>
      <Banner/>
      <MainNavbar/>
      <SearchBar/>
      <Outlet/>
    </>
  )
}

export default App
