import React from "react"
import LoginControl from "./LoginControl"
import { APIClient } from "@brigadecore/brigade-sdk"

const brigadeAPITokenKey = "brigade-api-token"
// TODO: Do not hardcode this
const apiAddress = "https://api.brigade2.io"
// TODO: Do not hardcode this
const loginSuccessURL = "http://localhost:3000/"

export default class App extends React.Component {

  handleLogin = async () => {
    const client = new APIClient(apiAddress, "")
    const thirdPartyAuthDetails = await client.authn().sessions().createUserSession(
      {
        successURL: loginSuccessURL
      }
    )
    localStorage.setItem(brigadeAPITokenKey, thirdPartyAuthDetails.token)
    window.location.href = thirdPartyAuthDetails.authURL
  }

  handleLogout = () => {
    localStorage.removeItem(brigadeAPITokenKey)
  }

  render(): JSX.Element {
    const loggedIn = localStorage.getItem(brigadeAPITokenKey) ? true : false
    return (
      <div>
        <header>
          <LoginControl loggedIn={loggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
        </header>
      </div>
    )
  }

}
