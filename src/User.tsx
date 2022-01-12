import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface UserProps {
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

  render(): React.ReactElement {
    const user = this.state.user
    return (
      <div>
        <h1>{user?.metadata.id}</h1>
        <div className="box">{user?.metadata.id} summary</div>
        <h2>Permissions -- TODO: Show user permissions</h2>
      </div>
    )
  }

}

export default function RoutedUser(): React.ReactElement {
  const params: any = useParams()
  return <User id={params.id}/>
}
