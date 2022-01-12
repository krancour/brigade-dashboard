import React, { CSSProperties } from "react"
import { NavLink, Outlet } from "react-router-dom"

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
    // TODO: This is cute for now, but we should do something nicer based on
    // a CSS class instead of a hardcoded style.
    const applyStyle = (props: {isActive: boolean}): CSSProperties => {
      return { 
        fontWeight: props.isActive ? "bold" : ""
      }
    }
    return (
      <div>
        <header>
          <ul>
            <li><NavLink style={applyStyle} to="/">Home</NavLink></li>
            <li><NavLink style={applyStyle} to="/projects">Projects</NavLink></li>
            <li><NavLink style={applyStyle} to="/events">Events</NavLink></li>
            <li><NavLink style={applyStyle} to="/users">Users</NavLink></li>
            <li><NavLink style={applyStyle} to="/service-accounts">Service Accounts</NavLink></li>
          </ul>
          <LoginControl loggedIn={loggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
          {/* TODO: Need to put some kind of breadcrumbs here */}
        </header>
        { loggedIn ? <Outlet/> : <div className="box">Log in to see this content.</div> }
      </div>
    )
  }

}
