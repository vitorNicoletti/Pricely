import { useState } from 'react'
import './App.css'
import Login from './components/Login/Login.jsx';
import Header from './components/Header/Header'
import Catalogo from './components/Catalog/Catalog.jsx'


import Footer from './components/Footer/Footer.jsx'



import Payment from './components/Payment/Payment.jsx'

function App() {

  return (
    <>
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      <div>
        <Catalogo/>
      </div>
    </>
  )
}

export default App