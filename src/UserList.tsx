import React from "react"
import { Link } from "react-router-dom"
import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import LockIcon from "./LockIcon"

const userListPageSize = 10
const itemRefreshInterval = 5000

interface UserListItemProps {
  user: authn.User
}

interface UserListItemState {
  locked: boolean
}

class UserListItem extends React.Component<UserListItemProps, UserListItemState> {

  // TODO: Let's not have every list item refresh itself. That creates problems
  // if/when one of the items in the list is deleted. Instead, let's make the
  // PagingControl automatically refresh the current page periodically.
  timer?: NodeJS.Timer

  constructor(props: UserListItemProps) {
    super(props)
    this.state = {
      locked: props.user.locked ? true : false
    }
  }

  refresh = async () => {
    this.setState({
      locked: (await getClient().authn().users().get(this.props.user.metadata.id)).locked ? true : false
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
    const linkTo = "/users/" + this.props.user.metadata.id
    return (
      <div className="box">
        <LockIcon locked={this.state.locked}/>&nbsp;&nbsp;<Link to={linkTo}>{this.props.user.metadata.id}</Link>
      </div>
    )
  }
}

interface UserListProps {
  items: authn.User[]
}

class UserList extends React.Component<UserListProps> {

  render(): React.ReactElement {
    const users = this.props.items
    return (
      <div>
        {
          users.map((user: authn.User) => (
            <UserListItem key={user.metadata.id} user={user}/>
          ))
        }
      </div>
    )
  }

}

export default withPagingControl(UserList, (continueVal: string): Promise<meta.List<authn.User>>  => {
  return getClient().authn().users().list({}, {
    continue: continueVal,
    limit: userListPageSize
  })
})
