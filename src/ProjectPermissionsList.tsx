import React from "react"

import Table from "react-bootstrap/Table"

import { authz, core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./components/PagingControl"
import PrincipalIcon from "./PrincipalIcon"

const permissionsListPageSize = 20

interface ProjectPermissionsListItemProps {
  projectRoleAssignment: core.ProjectRoleAssignment
}

interface ProjectPermissionsListItemState {
  locked: boolean | null
}

class ProjectPermissionsListItem extends React.Component<ProjectPermissionsListItemProps, ProjectPermissionsListItemState> {

  constructor(props: ProjectPermissionsListItemProps) {
    super(props)
    this.state = {
      locked: null
    }
  }

  async componentDidMount(): Promise<void> {
    let locked: boolean | null = null
    switch (this.props.projectRoleAssignment.principal.type) {
      case authz.PrincipalTypeServiceAccount:
        locked = (await getClient().authn().serviceAccounts().get(this.props.projectRoleAssignment.principal.id)).locked? true : false
        break
      case authz.PrincipalTypeUser:
        locked = (await getClient().authn().users().get(this.props.projectRoleAssignment.principal.id)).locked? true : false
        break
    }
    this.setState({
      locked: locked
    })
  }
  
  render(): React.ReactElement {
    return (
      <tr>
        <td>
          <PrincipalIcon principalType={this.props.projectRoleAssignment.principal.type} locked={this.state.locked}/>&nbsp;&nbsp;
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
