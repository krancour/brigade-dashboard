import React from "react"

import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { authn } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import Spinner from "./components/Spinner"

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
            <Card>
              <Card.Body>
                Placeholder
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="project-permissions" title="Project Permissions">
            <Card>
              <Card.Body>
                Placeholder
              </Card.Body>
            </Card>
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
      <Card>
        <Card.Body>
          Placeholder
        </Card.Body>
      </Card>
    )
  }

}
