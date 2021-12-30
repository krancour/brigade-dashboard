import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface UserProps {
  loggedIn: boolean
  id: string
}

interface UserState {
  user?: authn.User
}

class User extends React.Component<UserProps, UserState> {

  constructor(props: UserProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      user: await getClient().authn().users().get(this.props.id)
    })
  }

  // TODO: Clear state on unmount?

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view this service account.</p>
    }
    const user = this.state.user
    return (
      <div>
        <div className="box">{user?.metadata.id}</div>
        <div className="box">TODO: Show user permissions</div>
      </div>
    )
  }

}

interface RoutedUserProps {
  loggedIn: boolean  
}

export default function RoutedUser(props: RoutedUserProps): React.ReactElement {
  const params: any = useParams()
  return <User id={params.id} loggedIn={props.loggedIn}/>
}
