import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from '../Layouts/Home'
import links from './links'
// import HomePage from '../pages/HomePage'
// import LoginPage from '../pages/LoginPage'
// import RegisterPage from '../pages/RegisterPage'
 

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
      {
          links.map(link=>(
              <Route key={link.name} path={link.url} element={<link.component />} />
          ))
      }
      
      </Route>
    </Routes>
  )
}
