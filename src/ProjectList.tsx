import React from "react"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface ProjectListItemProps {
  project: core.Project
}

class ProjectListItem extends React.Component<ProjectListItemProps> {
  render(): React.ReactElement {
    return <li>{this.props.project.metadata.id}</li>
  }
}

interface ProjectListProps {
  loggedIn: boolean
}

interface ProjectListState {
  projects: core.Project[]
}

export default class ProjectList extends React.Component<ProjectListProps, ProjectListState> {

  constructor(props: ProjectListProps) {
    super(props)
    this.state = {
      projects: []
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      projects: (await getClient().core().projects().list()).items
    })
  }

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view projects.</p>
    }
    const projects = this.state.projects
    const projectListItems = projects.map((project: core.Project) => {
      return <ProjectListItem project={project}/>
    })
    return <ul>{projectListItems}</ul>
  }

}
