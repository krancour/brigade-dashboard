import React from "react"

import Table from "react-bootstrap/Table"

import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./components/PagingControl"
import PrincipalIcon from "./PrincipalIcon"

const permissionsListPageSize = 20

interface ProjectPermissionsListItemProps {
  projectRoleAssignment: core.ProjectRoleAssignment
}

class ProjectPermissionsListItem extends React.Component<ProjectPermissionsListItemProps> {

  render(): React.ReactElement {
    return (
      <tr>
        <td>
          <PrincipalIcon principalType={this.props.projectRoleAssignment.principal.type}/>&nbsp;&nbsp;
          {/* TODO: Make this link to the user or service account */}
          {this.props.projectRoleAssignment.principal.id}
        </td>
        <td>{this.props.projectRoleAssignment.role}</td>
      </tr>
    )
  }

}

interface ProjectPermissionsListProps {
  projectID: string
}

export default withPagingControl(
  (props: ProjectPermissionsListProps, continueVal: string): Promise<meta.List<core.ProjectRoleAssignment>>  => {
    return getClient().core().projects().authz().roleAssignments().list(props.projectID, {}, {
      continue: continueVal,
      limit: permissionsListPageSize
    })
  },
  (projectRoleAssignments: core.ProjectRoleAssignment[]): React.ReactElement => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Principal</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {
            projectRoleAssignments.map((projectRoleAssignment: core.ProjectRoleAssignment) => (
              <ProjectPermissionsListItem 
                key={projectRoleAssignment.principal.type + ":" + projectRoleAssignment.principal.id + ":" + projectRoleAssignment.role}
                projectRoleAssignment={projectRoleAssignment}
              />
            ))
          }
        </tbody>
      </Table>
    )
  }
)
