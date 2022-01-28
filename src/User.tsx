import React from "react"

import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { authn, authz } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import ComingSoon from "./components/ComingSoon"
import LockIcon from "./components/LockIcon"
import Spinner from "./components/Spinner"
import SystemPermissionsList from "./SystemPermissionsList"

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
    if (!user) {
      return <Spinner/>
    }
    return (
      <div>
        <h1>{user?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <UserSummary user={user}/>
          </Tab>
          <Tab eventKey="system-permissions" title="System Permissions">
          {/* TODO: Would be good to find a way to suppress the principal column here */}
          <SystemPermissionsList selector={{principal: {type: authz.PrincipalTypeUser, id: this.props.id}}}/>
          </Tab>
          <Tab eventKey="project-permissions" title="Project Permissions">
            <ComingSoon/>
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
    return (
      <Card bg="light">
        <Card.Header>
          <LockIcon locked={this.props.user?.locked ? true : false}/>&nbsp;&nbsp;
          {this.props.user?.metadata.id}
        </Card.Header>
        <Card.Body>
          Placeholder
        </Card.Body>
      </Card>
    )
  }

}
