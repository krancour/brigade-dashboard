import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"

import getClient from "./Client"

interface ServiceAccountProps {
  id: string
}

interface ServiceAccountState {
  serviceAccount?: authn.ServiceAccount
}

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
    return (
      <div>
        <h1>{serviceAccount?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <ServiceAccountSummary serviceAccount={serviceAccount}/>
          </Tab>
          <Tab eventKey="permissions" title="Permissions">
            <div className="box">Placeholder</div>
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
    return <div className="box">Placeholder</div>
  }

}
