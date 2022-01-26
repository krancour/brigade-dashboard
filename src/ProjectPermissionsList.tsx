import React from "react"

import Table from "react-bootstrap/Table"

import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl, { PagingControlProps } from "./components/PagingControl"
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

interface ProjectPermissionsListProps extends PagingControlProps {
  projectID: string
}

class ProjectPermissionsList extends React.Component<ProjectPermissionsListProps> {

  render(): React.ReactElement {
    const projectRoleAssignments = this.props.items as core.ProjectRoleAssignment[]
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

}

export default withPagingControl(ProjectPermissionsList, (props: any, continueVal: string): Promise<meta.List<core.ProjectRoleAssignment>>  => {
  const projectID = props.projectID as string
  return getClient().core().projects().authz().roleAssignments().list(projectID, {}, {
    continue: continueVal,
    limit: permissionsListPageSize
  })
})
