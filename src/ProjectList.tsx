import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"
import Box from "./Box"

const projectListPageSize = 10

interface ProjectListItemProps {
  project: core.Project
}

interface ProjectListItemState {
  lastEventWorkerPhase?: core.WorkerPhase
  ready: boolean
}

class ProjectListItem extends React.Component<ProjectListItemProps, ProjectListItemState> {

  constructor(props: ProjectListItemProps) {
    super(props)
    this.state = {
      ready: false
    }
  }

  async componentDidMount(): Promise<void> {
    const events = await getClient().core().events().list({
      projectID: this.props.project.metadata.id
    })
    this.setState({
      lastEventWorkerPhase: events.items?.length > 0 ? events.items[0].worker?.status.phase : undefined,
      ready: true,
    })
  }

  render(): React.ReactElement {
    const ready = this.state.ready
    if (!ready) {
      return <Box/>
    }
    const linkTo = "/projects/" + this.props.project.metadata.id
    return (
      <Box>
        <WorkerPhaseIcon phase={this.state.lastEventWorkerPhase}/>&nbsp;&nbsp;
        <Link to={linkTo}>{this.props.project.metadata.id}</Link>
      </Box>
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
