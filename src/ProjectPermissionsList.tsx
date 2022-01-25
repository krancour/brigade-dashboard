import React from "react"

import Table from "react-bootstrap/Table"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import PrincipalIcon from "./PrincipalIcon"

interface ProjectPermissionsListItemProps {
  projectRoleAssignment: core.ProjectRoleAssignment
}

class ProjectPermissionsListItem extends React.Component<ProjectPermissionsListItemProps> {

  render(): React.ReactElement {
    return (
      <tr>
        <td>
          <PrincipalIcon principalType={this.props.projectRoleAssignment.principal.type}/>&nbsp;&nbsp;
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

interface ProjectPermissionsListState {
  projectRoleAssignments: core.ProjectRoleAssignment[]
}

export default class ProjectPermissionsList extends React.Component<ProjectPermissionsListProps, ProjectPermissionsListState> {

  constructor(props: ProjectPermissionsListProps) {
    super(props)
    this.state = {
      projectRoleAssignments: []
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      projectRoleAssignments: (await getClient().core().projects().authz().roleAssignments().list(this.props.projectID)).items
    })
  }

  render(): React.ReactElement {
    const projectRoleAssignments = this.state.projectRoleAssignments
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
              <ProjectPermissionsListItem projectRoleAssignment={projectRoleAssignment}/>
            ))
          }
        </tbody>
      </Table>
    )
  }

}
