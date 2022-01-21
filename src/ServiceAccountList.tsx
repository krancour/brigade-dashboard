import React from "react"

import { Link } from "react-router-dom"

import { authn, meta } from "@brigadecore/brigade-sdk"

import Box from "./Box"
import getClient from "./Client"
import LockIcon from "./LockIcon"
import withPagingControl from "./PagingControl"

const serviceAccountListPageSize = 10

interface ServiceAccountListItemProps {
  serviceAccount: authn.ServiceAccount
}

class ServiceAccountListItem extends React.Component<ServiceAccountListItemProps> {

  refresh = async () => {
    this.setState({
      locked: (await getClient().authn().serviceAccounts().get(this.props.serviceAccount.metadata.id)).locked ? true : false
    })
  }

  componentDidMount(): void {
    this.refresh()
  }

  render(): React.ReactElement {
    const serviceAccount = this.props.serviceAccount
    const linkTo = "/service-accounts/" + serviceAccount.metadata.id
    return (
      <Box>
        <LockIcon locked={serviceAccount.locked ? true : false}/>&nbsp;&nbsp;<Link to={linkTo}>{this.props.serviceAccount.metadata.id}</Link>
      </Box>
    )
  }
}

interface ServiceAccountListProps {
  items: authn.ServiceAccount[]
}

// TODO: Make this use a table
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
