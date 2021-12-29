import React from "react"
import { core } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface ProjectListItemProps {
  project: core.Project
}

class ProjectListItem extends React.Component<ProjectListItemProps> {
  render(): React.ReactElement {
    // TODO: I don't love embedding this style here, but we NEED this and it
    // works well enough for now.
    const style = {
      height: 30,
      border: "1px solid green",
      margin: 6,
      padding: 8
    }
    return <div style={style}>{this.props.project.metadata.id}</div>
  }
}

interface ProjectListProps {
  loggedIn: boolean
}

interface ProjectListState {
  projects: core.Project[]
  continueVal: string
}

export default class ProjectList extends React.Component<ProjectListProps, ProjectListState> {

  constructor(props: ProjectListProps) {
    super(props)
    this.state = {
      projects: [],
      continueVal: ""
    }
  }

  async componentDidMount(): Promise<void> {
    if (this.props.loggedIn) {
      const projects = await getClient().core().projects().list({}, {
        continue: "",
        limit: 100
      })
      this.setState({
        projects: projects.items,
        continueVal: projects.metadata.continue || ""
      })
    }
  }

  fetch = async () => {
    const projects = this.state.projects
    const continueVal = this.state.continueVal
    const newProjects = await getClient().core().projects().list({}, {
      continue: continueVal,
      limit: 20
    })
    this.setState({
      projects: projects.concat(newProjects.items),
      continueVal: newProjects.metadata.continue || ""
    })
  }

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view projects.</p>
    }
    const projects = this.state.projects
    const hasMore = this.state.continueVal != ""
    return (
      <div>
        <InfiniteScroll dataLength={this.state.projects.length} next={this.fetch} hasMore={hasMore} loader={<h4>Loading...</h4>}>
          {projects.map((project: core.Project) => (
            <ProjectListItem key={project.metadata.id} project={project}/>
          ))}
        </InfiniteScroll>
      </div>
    )
  }

}
