import axios from '../ultill/axios.custom'
import { useEffect, useState } from 'react'
import Header from './component/layout/header'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'
import Footer from './component/layout/footer'

function App() {

  // useEffect(() => {
  //   const fectchHello = async () => {
  // Goi API
  // const res = await axios.get(`/`);
  //     console.log(">>>Res : ", res);
  //   }

  //   fectchHello();
  // }, [])

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
