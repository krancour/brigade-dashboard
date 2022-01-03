import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const projectListPageSize = 10

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
