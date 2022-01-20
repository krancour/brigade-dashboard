import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"

import getClient from "./Client"
import Placeholder from "./Placeholder"

interface UserProps {
  id: string
}

interface UserState {
  user?: authn.User
}

// TODO: Need to make this component auto-refresh
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
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <UserSummary user={user}/>
          </Tab>
          <Tab eventKey="permissions" title="Permissions">
            <Placeholder/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedUser(): React.ReactElement {
  const params: any = useParams()
  return <User id={params.id}/>
}

interface UserSummaryProps {
  user?: authn.User
}

class UserSummary extends React.Component<UserSummaryProps> {

  render(): React.ReactElement {
    return <Placeholder/>
  }

}
