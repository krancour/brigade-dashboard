import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const projectListPageSize = 10
const itemRefreshInterval = 5000

interface ProjectListItemProps {
  project: core.Project
}

interface ProjectListItemState {
  lastEventWorkerPhase?: core.WorkerPhase
}

class ProjectListItem extends React.Component<ProjectListItemProps, ProjectListItemState> {

  timer: any // TODO: This should not be any

  constructor(props: ProjectListItemProps) {
    super(props)
    this.state = {}
  }

  refresh = async () => {
    const events = await getClient().core().events().list({
      projectID: this.props.project.metadata.id
    })
    this.setState({
      lastEventWorkerPhase: events.items?.length > 0 ? events.items[0].worker?.status.phase : undefined
    })
  }

  componentDidMount(): void {
    this.refresh()
    this.timer = setInterval(this.refresh, itemRefreshInterval)
  }

  componentWillUnmount(): void {
    clearInterval(this.timer)
  }

  render(): React.ReactElement {
    const linkTo = "/projects/" + this.props.project.metadata.id
    const status = this.state.lastEventWorkerPhase ? this.state.lastEventWorkerPhase : "NONE"
    return (
      <div className="box">
        {status}&nbsp;&nbsp;<Link to={linkTo}>{this.props.project.metadata.id}</Link>
      </div>
    )
  }

}

interface ProjectListProps {
  items: core.Project[]
}

class ProjectList extends React.Component<ProjectListProps> {

  render(): React.ReactElement {
    const projects = this.props.items
    return (
      <div>
        {
          projects.map((project: core.Project) => (
            <ProjectListItem key={project.metadata.id} project={project}/>
          ))
        }
      </div>
    )
  }

}

export default withPagingControl(ProjectList, (continueVal: string): Promise<meta.List<core.Project>>  => {
  return getClient().core().projects().list({}, {
    continue: continueVal,
    limit: projectListPageSize
  })
})
