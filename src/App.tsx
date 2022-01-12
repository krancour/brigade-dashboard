import React from "react"
import { Link, Outlet } from "react-router-dom"

import getClient from "./Client"
import * as config from "./Config"
import LoginControl from "./LoginControl"

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
        { loggedIn ? <Outlet/> : <div className="box">Log in to see this content.</div> }
      </div>
    )
  }

}
