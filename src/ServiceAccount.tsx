import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface ServiceAccountProps {
  loggedIn: boolean
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

  // TODO: Clear state on unmount?

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view this service account.</p>
    }
    const serviceAccount = this.state.serviceAccount
    return (
      <div>
        <div className="box">{serviceAccount?.metadata.id}</div>
        <div className="box">TODO: Show service account permissions</div>
      </div>
    )
  }

}

interface RoutedServiceAccountProps {
  loggedIn: boolean  
}

export default function RoutedServiceAccount(props: RoutedServiceAccountProps): React.ReactElement {
  const params: any = useParams()
  return <ServiceAccount id={params.id} loggedIn={props.loggedIn}/>
}
