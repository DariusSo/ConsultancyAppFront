import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TopHeader from './components/TopHeader'
import Login from './pages/Login'
import Register from './pages/Registration'
import HeroSection from './components/HeroSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopHeader/>
      <HeroSection/>
    </>
  )
}

export default App
