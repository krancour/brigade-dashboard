import React from "react"

import Table from "react-bootstrap/Table"

import libAuthz from "@brigadecore/brigade-sdk/dist/lib/authz"

import PrincipalIcon from "./PrincipalIcon"
import { authz, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./components/PagingControl"

const permissionsListPageSize = 20

interface SystemPermissionsListItemProps {
  roleAssignment: libAuthz.RoleAssignment
}

class SystemPermissionsListItem extends React.Component<SystemPermissionsListItemProps> {

  render(): React.ReactElement {
    return (
      <tr>
        <td>
          <PrincipalIcon principalType={this.props.roleAssignment.principal.type}/>&nbsp;&nbsp;
          {/* TODO: Make this link to the user or service account */}
          {this.props.roleAssignment.principal.id}
        </td>
        <td>{this.props.roleAssignment.role}</td>
        <td>{this.props.roleAssignment.scope}</td>
      </tr>
    )
  }

}

interface SystemPermissionsListProps {
  selector?: authz.RoleAssignmentsSelector
}

export default withPagingControl(
  (props: SystemPermissionsListProps, continueVal: string): Promise<meta.List<libAuthz.RoleAssignment>>  => {
    return getClient().authz().roleAssignments().list(props.selector, {
      continue: continueVal,
      limit: permissionsListPageSize
    })
  },
  (roleAssignments: libAuthz.RoleAssignment[]): React.ReactElement => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Principal</th>
            <th>Role</th>
            <th>Scope</th>
          </tr>
        </thead>
        <tbody>
          {
            roleAssignments.map((roleAssignment: libAuthz.RoleAssignment) => (
              <SystemPermissionsListItem 
                key={roleAssignment.principal.type + ":" + roleAssignment.principal.id + ":" + roleAssignment.role}
                roleAssignment={roleAssignment}
              />
            ))
          }
        </tbody>
      </Table>
    )
  }
)
