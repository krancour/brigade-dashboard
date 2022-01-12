import React from "react"
import { useParams } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"

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
        <div className="box">{serviceAccount?.metadata.id} summary</div>
        <h2>Permissions -- TODO: Show service account permissions</h2>
      </div>
    )
  }

}

export default function RoutedServiceAccount(): React.ReactElement {
  const params: any = useParams()
  return <ServiceAccount id={params.id}/>
}
