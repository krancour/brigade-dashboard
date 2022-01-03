import React from "react"
import { Link } from "react-router-dom"
import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const serviceAccountListPageSize = 10

interface ServiceAccountListItemProps {
  serviceAccount: authn.ServiceAccount
}

class ServiceAccountListItem extends React.Component<ServiceAccountListItemProps> {
  render(): React.ReactElement {
    const linkTo = "/service-accounts/" + this.props.serviceAccount.metadata.id
    return (
      <div className="box">
        <Link to={linkTo}>{this.props.serviceAccount.metadata.id}</Link>
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
