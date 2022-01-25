import React from "react"

import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { authn } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import Spinner from "./components/Spinner"

interface ServiceAccountProps {
  id: string
}

interface ServiceAccountState {
  serviceAccount?: authn.ServiceAccount
}

// TODO: Need to make this component auto-refresh
class ServiceAccount extends React.Component<ServiceAccountProps, ServiceAccountState> {

  constructor(props: ServiceAccountProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      serviceAccount: await getClient().authn().serviceAccounts().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const serviceAccount = this.state.serviceAccount
    if (!serviceAccount) {
      return <Spinner/>
    }
    return (
      <div>
        <h1>{serviceAccount?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <ServiceAccountSummary serviceAccount={serviceAccount}/>
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

export default function RoutedServiceAccount(): React.ReactElement {
  const params: any = useParams()
  return <ServiceAccount id={params.id}/>
}

interface ServiceAccountSummaryProps {
  serviceAccount?: authn.ServiceAccount
}

class ServiceAccountSummary extends React.Component<ServiceAccountSummaryProps> {

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
