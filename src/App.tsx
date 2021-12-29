import React from "react"
import LoginControl from "./LoginControl"
import { APIClient } from "@brigadecore/brigade-sdk"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const brigadeAPITokenKey = "brigade-api-token"
// TODO: Do not hardcode this
const apiAddress = "https://api.brigade2.io"

export default class App extends React.Component {

  handleLogin = async () => {
    const client = new APIClient(apiAddress, "")
    const thirdPartyAuthDetails = await client.authn().sessions().createUserSession(
      {
        successURL: window.location.href
      }
    )
    localStorage.setItem(brigadeAPITokenKey, thirdPartyAuthDetails.token)
    window.location.href = thirdPartyAuthDetails.authURL
  }

  handleLogout = () => {
    localStorage.removeItem(brigadeAPITokenKey)
  }

  render(): React.ReactElement {
    const loggedIn = localStorage.getItem(brigadeAPITokenKey) ? true : false
    return (
      <Router>
        <div>
          <header>
            <LoginControl loggedIn={loggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
          </header>
          <Routes>
            <Route path='/' element={<ProjectList/>}></Route>
            <Route path='/events' element={<EventList/>}></Route>
          </Routes>
        </div>
      </Router>
    )
  }

}

// TODO: Move this to its own file and flesh it out
class ProjectList extends React.Component {
  render(): React.ReactElement {
    return <p>Project List!</p>
  }
}

// TODO: Move this to its own file and flesh it out
class EventList extends React.Component {
  render(): React.ReactElement {
    return <p>Event List!</p>
  }
}
