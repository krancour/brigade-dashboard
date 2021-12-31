import React from "react"
import { Link } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

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

interface ServiceAccountListProps {}

interface ServiceAccountListState {
  serviceAccounts: authn.ServiceAccount[]
  continueVal: string
}

export default class ServiceAccountList extends React.Component<ServiceAccountListProps, ServiceAccountListState> {

  constructor(props: ServiceAccountListProps) {
    super(props)
    this.state = {
      serviceAccounts: [],
      continueVal: ""
    }
  }

  async componentDidMount(): Promise<void> {
    const serviceAccounts = await getClient().authn().serviceAccounts().list({}, {
      continue: "",
      limit: 100
    })
    this.setState({
      serviceAccounts: serviceAccounts.items,
      continueVal: serviceAccounts.metadata.continue || ""
    })
  }

  fetch = async () => {
    const serviceAccounts = this.state.serviceAccounts
    const continueVal = this.state.continueVal
    const newServiceAccounts = await getClient().authn().serviceAccounts().list({}, {
      continue: continueVal,
      limit: 20
    })
    this.setState({
      serviceAccounts: serviceAccounts.concat(newServiceAccounts.items),
      continueVal: newServiceAccounts.metadata.continue || ""
    })
  }

  render(): React.ReactElement {
    const serviceAccounts = this.state.serviceAccounts
    const hasMore = this.state.continueVal !== ""
    return (
      <div>
        <InfiniteScroll dataLength={this.state.serviceAccounts.length} next={this.fetch} hasMore={hasMore} loader={<h4>Loading...</h4>}>
          {serviceAccounts.map((serviceAccount: authn.ServiceAccount) => (
            <ServiceAccountListItem key={serviceAccount.metadata.id} serviceAccount={serviceAccount}/>
          ))}
        </InfiniteScroll>
      </div>
    )
  }

}
