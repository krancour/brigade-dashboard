import React from "react"
import { Link, Routes, Route, Outlet } from "react-router-dom"

import getClient from "./Client"
import * as config from "./Config"
import Event from "./Event"
import EventList from "./EventList"
import LoginControl from "./LoginControl"
import Project from "./Project"
import ProjectList from "./ProjectList"
import ServiceAccount from "./ServiceAccount"
import ServiceAccountList from "./ServiceAccountList"
import User from "./User"
import UserList from "./UserList"

import './App.css'

interface AppProps {}

interface AppState {
  loggedIn: boolean
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)
    this.state = {
      loggedIn: localStorage.getItem(config.brigadeAPITokenKey) ? true : false
    }
  }

  handleLogin = async () => {
    const sessionsClient = getClient().authn().sessions()
    const thirdPartyAuthDetails = await sessionsClient.createUserSession(
      {
        successURL: window.location.href
      }
    )
    localStorage.setItem(config.brigadeAPITokenKey, thirdPartyAuthDetails.token)
    window.location.href = thirdPartyAuthDetails.authURL
  }

  handleLogout = () => {
    this.setState({
      loggedIn: false
    })
    localStorage.removeItem(config.brigadeAPITokenKey)
  }

  render(): React.ReactElement {
    const loggedIn = this.state.loggedIn
    return (
        <div>
          <header>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/service-accounts">Service Accounts</Link></li>
            </ul>
            <LoginControl loggedIn={loggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
            {/* TODO: Need to put some kind of breadcrumbs here */}
          </header>
          { 
            loggedIn // If logged in, use routes; else tell the user to log in
            ? 
              <div>
                <Routes>
                  <Route path='/' element={<ProjectList/>}/>
                  <Route path='/projects' element={<ProjectList/>}/>
                  <Route path="/projects/:id" element={<Project/>}/>
                  <Route path='/events' element={<EventList/>}/>
                  <Route path='/events/:id' element={<Event/>}/>
                  <Route path='/users' element={<UserList/>}/>
                  <Route path='/users/:id' element={<User/>}/>
                  <Route path='/service-accounts' element={<ServiceAccountList/>}/>
                  <Route path='/service-accounts/:id' element={<ServiceAccount/>}/>
                  <Route path="*" element={<h1>404</h1>}/>
                </Routes>
                <Outlet/>
              </div>
            :
              <div className="box">Log in to see this content.</div>
          }
        </div>
    )
  }

}
