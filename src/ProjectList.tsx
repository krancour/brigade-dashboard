import React from "react"
import { Link } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface ProjectListItemProps {
  project: core.Project
}

class ProjectListItem extends React.Component<ProjectListItemProps> {
  render(): React.ReactElement {
    const linkTo = "/projects/" + this.props.project.metadata.id
    return (
      <div className="box">
        <Link to={linkTo}>{this.props.project.metadata.id}</Link>
      </div>
    )
  }
}

interface ProjectListProps {}

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
    const projects = await getClient().core().projects().list({}, {
      continue: "",
      limit: 100
    })
    this.setState({
      projects: projects.items,
      continueVal: projects.metadata.continue || ""
    })
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
    const projects = this.state.projects
    const hasMore = this.state.continueVal !== ""
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
