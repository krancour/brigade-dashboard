import React from "react"
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom"

import getClient from "./Client"
import * as config from "./Config"
import EventList from "./EventList"
import LoginControl from "./LoginControl"
import ProjectList from "./ProjectList"
import ServiceAccountList from "./ServiceAccountList"
import UserList from "./UserList"

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
      <Router>
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
          </header>
          <Routes>
            <Route path='/' element={<ProjectList loggedIn={loggedIn}/>}></Route>
            <Route path='/projects' element={<ProjectList loggedIn={loggedIn}/>}></Route>
            <Route path='/events' element={<EventList loggedIn={loggedIn}/>}></Route>
            <Route path='/users' element={<UserList loggedIn={loggedIn}/>}></Route>
            <Route path='/service-accounts' element={<ServiceAccountList loggedIn={loggedIn}/>}></Route>
            <Route path="*" element={<h1>404</h1>}/>
          </Routes>
        </div>
      </Router>
    )
  }

}
