import React from "react"
import { Link } from "react-router-dom"
import { authn } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface UserListItemProps {
  user: authn.User
}

class UserListItem extends React.Component<UserListItemProps> {
  render(): React.ReactElement {
    const linkTo = "/users/" + this.props.user.metadata.id
    return (
      <div className="box">
        <Link to={linkTo}>{this.props.user.metadata.id}</Link>
      </div>
    )
  }
}

interface UserListProps {}

interface UserListState {
  users: authn.User[]
  continueVal: string
}

export default class UserList extends React.Component<UserListProps, UserListState> {

  constructor(props: UserListProps) {
    super(props)
    this.state = {
      users: [],
      continueVal: ""
    }
  }

  async componentDidMount(): Promise<void> {
    // TODO: There's a bug API that manifests when we include list options.
    // https://github.com/brigadecore/brigade/pull/1773 contains the fix.
    // That will make Brigade v2.2.0 the minimum version for Kashti TNG.
    // const users = await getClient().authn().users().list({}, {
    //   continue: "",
    //   limit: 100
    // })
    const users = await getClient().authn().users().list()
    this.setState({
      users: users.items,
      continueVal: users.metadata.continue || ""
    })
  }

  fetch = async () => {
    const users = this.state.users
    const continueVal = this.state.continueVal
    const newUsers = await getClient().authn().users().list({}, {
      continue: continueVal,
      limit: 20
    })
    this.setState({
      users: users.concat(newUsers.items),
      continueVal: newUsers.metadata.continue || ""
    })
  }

  render(): React.ReactElement {
    const users = this.state.users
    const hasMore = this.state.continueVal !== ""
    return (
      <div>
        <InfiniteScroll dataLength={this.state.users.length} next={this.fetch} hasMore={hasMore} loader={<h4>Loading...</h4>}>
          {users.map((user: authn.User) => (
            <UserListItem key={user.metadata.id} user={user}/>
          ))}
        </InfiniteScroll>
      </div>
    )
  }

}
