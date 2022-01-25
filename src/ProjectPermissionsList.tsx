import React from "react"

import Table from "react-bootstrap/Table"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import NextButton from "./components/NextButton"
import PreviousButton from "./components/PreviousButton"
import PrincipalIcon from "./PrincipalIcon"
import Spinner from "./components/Spinner"

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

interface ProjectPermissionsListState {
  prevContinueVals: string[]
  currentContinueVal: string,
  items: core.ProjectRoleAssignment[]
  nextContinueVal?: string
}

export default class ProjectPermissionsList extends React.Component<ProjectPermissionsListProps, ProjectPermissionsListState> {

  constructor(props: ProjectPermissionsListProps) {
    super(props)
    this.state = {
      prevContinueVals: [],
      currentContinueVal: "",
      items: []
    }
  }

  async componentDidMount(): Promise<void> {
    const page = await getClient().core().projects().authz().roleAssignments().list(
      this.props.projectID,
      {},
      {
        continue: "",
        limit: permissionsListPageSize
      }
    )
    this.setState({
      items: page.items,
      nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
    })
  }

    fetchPreviousPage = async () => {
      const prevContinueVals = this.state.prevContinueVals
      if (prevContinueVals.length > 0) {
        const currentContinueVal = prevContinueVals.pop() || ""
        const page = await getClient().core().projects().authz().roleAssignments().list(
          this.props.projectID, {}, {
            continue: currentContinueVal,
            limit: permissionsListPageSize
          }
        )
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    fetchNextPage = async () => {
      let nextContinueVal = this.state.nextContinueVal
      if (nextContinueVal) {
        const prevContinueVals = this.state.prevContinueVals
        prevContinueVals.push(this.state.currentContinueVal)
        const currentContinueVal = nextContinueVal
        const page = await getClient().core().projects().authz().roleAssignments().list(
          this.props.projectID, {}, {
            continue: currentContinueVal,
            limit: permissionsListPageSize
          }
        )
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

  render(): React.ReactElement {
    const projectRoleAssignments = this.state.items
    if (projectRoleAssignments.length == 0) {
      return <Spinner/>
    }
    const hasPrev = this.state.prevContinueVals.length > 0
    const hasMore = this.state.nextContinueVal ? true : false
    return (
      <div>
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
        { hasPrev && <PreviousButton onClick={this.fetchPreviousPage}/> }
        { hasMore && <NextButton onClick={this.fetchNextPage}/> }
      </div>
    )
  }

}
