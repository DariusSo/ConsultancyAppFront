import { useState } from 'react'
import './App.css'
import TopHeader from './components/TopHeader'
import Banner from './components/Banner'
import { Outlet } from 'react-router-dom'
import MainNavbar from './components/MainNavbar'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopHeader/>
      <Banner/>
      <MainNavbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
