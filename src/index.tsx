import React from "react"

import ReactDOM from "react-dom"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from './App'
import Event from "./Event"
import EventList from "./EventList"
import Project from "./Project"
import ProjectList from "./ProjectList"
import ServiceAccount from "./ServiceAccount"
import ServiceAccountList from "./ServiceAccountList"
import User from "./User"
import UserList from "./UserList"

import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<ProjectList/>}/>
          <Route path="projects" element={<ProjectList/>}/>
          <Route path="projects/:id" element={<Project/>}/>
          <Route path="events" element={<EventList/>}/>
          <Route path="events/:id" element={<Event/>}/>
          <Route path="users" element={<UserList/>}/>
          <Route path="users/:id" element={<User/>}/>
          <Route path="service-accounts" element={<ServiceAccountList/>}/>
          <Route path="service-accounts/:id" element={<ServiceAccount/>}/>
          <Route path="*" element={<h1>404</h1>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
