import React from "react"
import { authn } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface UserListItemProps {
  user: authn.User
}

class UserListItem extends React.Component<UserListItemProps> {
  render(): React.ReactElement {
    // TODO: I don't love embedding this style here, but we NEED this and it
    // works well enough for now.
    const style = {
      height: 30,
      border: "1px solid green",
      margin: 6,
      padding: 8
    }
    return <div style={style}>{this.props.user.metadata.id}</div>
  }
}

interface UserListProps {
  loggedIn: boolean
}

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
    if (this.props.loggedIn) {
      // TODO: There's a bug in either the SDK or the API here. When we include
      // list options, we get no list metadata.
      const users = await getClient().authn().users().list({}, {
        continue: "",
        limit: 100
      })
      // TODO: This next line demonstrates the error
      console.log("users: %o", users)
      this.setState({
        users: users.items,
        continueVal: users.metadata.continue || ""
      })
    }
  }

  // TODO: Clear state on unmount?

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
    if (!this.props.loggedIn) {
      return <p>Log in to view users.</p>
    }
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
