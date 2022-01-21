import React from "react"

import UserList from "./UserList"

export default class Users extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1>Users</h1>
        <UserList/>
      </div>
    )
  }

}
