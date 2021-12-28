import React from "react"
import LoginControl from "./LoginControl"
import { APIClient } from "@brigadecore/brigade-sdk"

const apiAddress = "https://api.brigade2.io"

export default class App extends React.Component {

  handleLogin = () => {
    const client = new APIClient(apiAddress, "")
  }

  handleLogout = () => {
  }

  render(): JSX.Element {
    const loggedIn = localStorage.getItem("brigade-api-token") ? true : false
    return (
      <div>
        <header>
          <LoginControl loggedIn={loggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
        </header>
      </div>
    )
  }

}

