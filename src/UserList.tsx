import React from "react"
import { Link } from "react-router-dom"
import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import LockIcon from "./LockIcon"
import Box from "./Box"

const userListPageSize = 10

interface UserListItemProps {
  user: authn.User
}

class UserListItem extends React.Component<UserListItemProps> {

  render(): React.ReactElement {
    const user = this.props.user
    const linkTo = "/users/" + this.props.user.metadata.id
    return (
      <Box>
        <LockIcon locked={user.locked ? true : false}/>&nbsp;&nbsp;<Link to={linkTo}>{this.props.user.metadata.id}</Link>
      </Box>
    )
  }
}

interface UserListProps {
  items: authn.User[]
}

// TODO: Make this use a table
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
