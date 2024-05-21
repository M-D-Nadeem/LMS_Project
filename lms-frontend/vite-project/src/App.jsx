
import React from 'react'
import Footer from './components/Footer'
import MenuLayout from './components/MenuLayout'
import { Outlet } from 'react-router-dom'


function App() {
 

  return (
    <div className='relative min-h-screen'>
     
     <MenuLayout />
     <Outlet />
     <Footer />
     
    </div>
  )
}

export default App
