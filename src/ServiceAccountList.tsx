import React from "react"
import { Link } from "react-router-dom"
import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const serviceAccountListPageSize = 10
const itemRefreshInterval = 5000

interface ServiceAccountListItemProps {
  serviceAccount: authn.ServiceAccount
}

interface ServiceAccountListItemState {
  locked: boolean
}

class ServiceAccountListItem extends React.Component<ServiceAccountListItemProps, ServiceAccountListItemState> {

  timer?: NodeJS.Timer

  constructor(props: ServiceAccountListItemProps) {
    super(props)
    this.state = {
      locked: props.serviceAccount.locked ? true : false
    }
  }

  refresh = async () => {
    this.setState({
      locked: (await getClient().authn().serviceAccounts().get(this.props.serviceAccount.metadata.id)).locked ? true : false
    })
  }

  componentDidMount(): void {
    this.refresh()
    this.timer = setInterval(this.refresh, itemRefreshInterval)
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  render(): React.ReactElement {
    const linkTo = "/service-accounts/" + this.props.serviceAccount.metadata.id
    const status = this.state.locked ? "LOCKED" : "UNLOCKED"
    return (
      <div className="box">
        {status}&nbsp;&nbsp;<Link to={linkTo}>{this.props.serviceAccount.metadata.id}</Link>
      </div>
    )
  }
}

interface ServiceAccountListProps {
  items: authn.ServiceAccount[]
}

class ServiceAccountList extends React.Component<ServiceAccountListProps> {

  render(): React.ReactElement {
    const serviceAccounts = this.props.items
    return (
      <div>
        {
          serviceAccounts.map((serviceAccount: authn.ServiceAccount) => (
            <ServiceAccountListItem key={serviceAccount.metadata.id} serviceAccount={serviceAccount}/>
          ))
        }
      </div>
    )
  }

}

export default withPagingControl(ServiceAccountList, (continueVal: string): Promise<meta.List<authn.ServiceAccount>>  => {
  return getClient().authn().serviceAccounts().list({}, {
    continue: continueVal,
    limit: serviceAccountListPageSize
  })
})
