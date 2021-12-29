import React from 'react'

interface LoginControlProps {
  loggedIn: boolean
  onLogin: () => void
  onLogout: () => void
}

interface LoginControlState {
  loggedIn: boolean
}

export default class LoginControl extends React.Component<LoginControlProps, LoginControlState> {

  constructor(props: LoginControlProps) {
    super(props)
    this.state = {loggedIn: props.loggedIn}
  }

  handleLogin = () => {
    this.setState({loggedIn: true})
    this.props.onLogin()
  }

  handleLogout = () => {
    this.setState({loggedIn: false})
    this.props.onLogout()
  }

  render(): React.ReactElement {
    const loggedIn = this.state.loggedIn
    let button
    if (!loggedIn) {
      button = <button onClick={this.handleLogin}>Login</button>
    } else {
      button = <button onClick={this.handleLogout}>Logout</button>
    }
    return <div>{button}</div>
  }

}
