import React from "react"

import SystemPermissionsList from "./SystemPermissionsList"

export default class SystemPermissions extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1>System Permissions</h1>
        <SystemPermissionsList/>
      </div>
    )
  }

}
