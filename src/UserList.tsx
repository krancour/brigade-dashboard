import React from "react"
import { Link } from "react-router-dom"
import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const userListPageSize = 10

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
