import React from "react"
import { authn } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface ServiceAccountListItemProps {
  serviceAccount: authn.ServiceAccount
}

class ServiceAccountListItem extends React.Component<ServiceAccountListItemProps> {
  render(): React.ReactElement {
    // TODO: I don't love embedding this style here, but we NEED this and it
    // works well enough for now.
    const style = {
      height: 30,
      border: "1px solid green",
      margin: 6,
      padding: 8
    }
    return <div style={style}>{this.props.serviceAccount.metadata.id}</div>
  }
}

interface ServiceAccountListProps {
  loggedIn: boolean
}

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
    if (this.props.loggedIn) {
      // TODO: There's a bug API that manifests when we include list options.
      // https://github.com/brigadecore/brigade/pull/1773 contains the fix.
      // That will make Brigade v2.2.0 the minimum version for Kashti TNG.
      const serviceAccounts = await getClient().authn().serviceAccounts().list({}, {
        continue: "",
        limit: 100
      })
      this.setState({
        serviceAccounts: serviceAccounts.items,
        continueVal: serviceAccounts.metadata.continue || ""
      })
    }
  }

  // TODO: Clear state on unmount?

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
    if (!this.props.loggedIn) {
      return <p>Log in to view service accounts.</p>
    }
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
