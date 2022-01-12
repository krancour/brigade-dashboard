import React from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import EventList from "./EventList"

interface ProjectProps {
  id: string
  activeTab: string
}

interface ProjectState {
  project?: core.Project
}

class Project extends React.Component<ProjectProps, ProjectState> {

  constructor(props: ProjectProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      project: await getClient().core().projects().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const project = this.state.project
    return (
      <div>
        <h1>{project?.metadata.id}</h1>
        <ul>
          <li><Link to={"/projects/" + this.props.id + "?tab=summary"}>Summary</Link></li>
          <li><Link to={"/projects/" + this.props.id + "?tab=yaml"}>YAML</Link></li>
        </ul>
        {
          ((): React.ReactElement => {
            switch (this.props.activeTab) {
              case "summary":
              case "":
                return <ProjectSummary project={project}>Summary</ProjectSummary>
              case "yaml":
                return <ProjectYAML project={project}>YAML</ProjectYAML>
              default:
                return <div/>
            }
          })()
        }
        <h2>Events -- TODO: Filter by project</h2>
        <EventList/>
      </div>
    )
  }

}

export default function RoutedProject(): React.ReactElement {
  const pathParams = useParams()
  const [queryParams] = useSearchParams()
  return <Project id={pathParams.id || ""} activeTab={queryParams.get("tab") || ""}/>
}

interface ProjectSummaryProps {
  project?: core.Project
}

class ProjectSummary extends React.Component<ProjectSummaryProps> {

  constructor(props: ProjectSummaryProps) {
    super(props)
  }

  render(): React.ReactElement {
    const project = this.props.project
    return <div className="box">{project?.metadata.id} summary</div>
  }

}

interface ProjectYAMLProps {
  project?: core.Project
}

class ProjectYAML extends React.Component<ProjectYAMLProps> {

  constructor(props: ProjectYAMLProps) {
    super(props)
  }

  render(): React.ReactElement {
    const project = this.props.project
    return <div className="box">{project?.metadata.id} YAML</div>
  }

}
