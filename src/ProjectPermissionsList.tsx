import React from "react"

import Table from "react-bootstrap/Table"

import { authz, core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./components/PagingControl"
import PrincipalIcon from "./PrincipalIcon"

const permissionsListPageSize = 20

interface ProjectPermissionsListItemProps {
  projectRoleAssignment: core.ProjectRoleAssignment
  suppressPrincipalColumn?: boolean
  suppressProjectColumn?: boolean
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
        { this.props.suppressPrincipalColumn ? null : (
          <td>
            <PrincipalIcon principalType={this.props.projectRoleAssignment.principal.type} locked={this.state.locked}/>&nbsp;&nbsp;
            {/* TODO: Make this link to the user or service account */}
            {this.props.projectRoleAssignment.principal.id}
          </td>
        )}
        { this.props.suppressProjectColumn ? null : (
          <td>
            {/* TODO: Make this link to the project */}
            {this.props.projectRoleAssignment.projectID}
          </td>
        )}
        <td>{this.props.projectRoleAssignment.role}</td>
      </tr>
    )
  }

}

interface ProjectPermissionsListProps {
  projectID?: string
  selector?: core.ProjectRoleAssignmentsSelector
}

export default withPagingControl(
  (props: ProjectPermissionsListProps, continueVal: string): Promise<meta.List<core.ProjectRoleAssignment>>  => {
    return getClient().core().projects().authz().roleAssignments().list(props.projectID || "", props.selector, {
      continue: continueVal,
      limit: permissionsListPageSize
    })
  },
  (projectRoleAssignments: core.ProjectRoleAssignment[], props: ProjectPermissionsListProps): React.ReactElement => {
    const suppressPrincipalColumn = props.selector?.principal ? true : false
    const suppressProjectColumn = props.projectID ? true : false
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            { suppressPrincipalColumn ? null : <th>Principal</th> }
            { suppressProjectColumn ? null : <th>Project</th> }
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {
            projectRoleAssignments.map((projectRoleAssignment: core.ProjectRoleAssignment) => (
              <ProjectPermissionsListItem 
                key={projectRoleAssignment.principal.type + ":" + projectRoleAssignment.principal.id + ":" + projectRoleAssignment.projectID + ":" + projectRoleAssignment.role}
                projectRoleAssignment={projectRoleAssignment}
                suppressPrincipalColumn={suppressPrincipalColumn}
                suppressProjectColumn={suppressProjectColumn}
              />
            ))
          }
        </tbody>
      </Table>
    )
  }
)
