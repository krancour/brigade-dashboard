import React from "react"

import ReactDOM from "react-dom"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from './App'
import Event from "./Event"
import Events from "./Events"
import Project from "./Project"
import Projects from "./Projects"
import ServiceAccount from "./ServiceAccount"
import ServiceAccounts from "./ServiceAccounts"
import User from "./User"
import Users from "./Users"

import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Projects/>}/>
          <Route path="projects" element={<Projects/>}/>
          <Route path="projects/:id" element={<Project/>}/>
          <Route path="events" element={<Events/>}/>
          <Route path="events/:id" element={<Event/>}/>
          <Route path="users" element={<Users/>}/>
          <Route path="users/:id" element={<User/>}/>
          <Route path="service-accounts" element={<ServiceAccounts/>}/>
          <Route path="service-accounts/:id" element={<ServiceAccount/>}/>
          <Route path="*" element={<h1>404</h1>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
