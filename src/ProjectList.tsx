import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const projectListPageSize = 10
const itemRefreshInterval = 5000

interface ProjectListItemProps {
  project: core.Project
}

interface ProjectListItemState {
  lastEventWorkerPhase?: core.WorkerPhase
  ready: boolean
}

class ProjectListItem extends React.Component<ProjectListItemProps, ProjectListItemState> {

  // TODO: Let's not have every list item refresh itself. That creates problems
  // if/when one of the items in the list is deleted. Instead, let's make the
  // PagingControl automatically refresh the current page periodically.
  timer?: NodeJS.Timer

  constructor(props: ProjectListItemProps) {
    super(props)
    this.state = {
      ready: false
    }
  }

  refresh = async () => {
    const events = await getClient().core().events().list({
      projectID: this.props.project.metadata.id
    })
    this.setState({
      lastEventWorkerPhase: events.items?.length > 0 ? events.items[0].worker?.status.phase : undefined,
      ready: true,
    })
  }

  componentDidMount(): void {
    this.refresh()
    this.timer = setInterval(this.refresh, itemRefreshInterval)
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  render(): React.ReactElement {
    const ready = this.state.ready
    if (!ready) {
      return <div className="box"/>
    }
    const linkTo = "/projects/" + this.props.project.metadata.id
    return (
      <div className="box">
        <WorkerPhaseIcon phase={this.state.lastEventWorkerPhase}/>&nbsp;&nbsp;
        <Link to={linkTo}>{this.props.project.metadata.id}</Link>
      </div>
    )
  }

}

interface ProjectListProps {
  items: core.Project[]
}

// TODO: Make this use a table
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
