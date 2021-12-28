import React from 'react'

interface LoginButtonProps {
  onClick: () => void
}

class LoginButton extends React.Component<LoginButtonProps> {

  render(): JSX.Element {
    return <button onClick={this.props.onClick}>Login</button>
  }

}

interface LogoutButtonProps {
  onClick: () => void
}

class LogoutButton extends React.Component<LogoutButtonProps> {

  render(): JSX.Element {
    return <button onClick={this.props.onClick}>Logout</button>
  }

}

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

  render(): JSX.Element {
    const loggedIn = this.state.loggedIn
    let button
    if (!loggedIn) {
      button = <LoginButton onClick={this.handleLogin}/>
    } else {
      button = <LogoutButton onClick={this.handleLogout}/>
    }
    return <div>{button}</div>
  }

}
