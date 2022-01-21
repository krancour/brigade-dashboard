import React from "react"

import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import EventList from "./EventList"
import Placeholder from "./Placeholder"
import Spinner from "./Spinner"
import YAMLViewer from "./YAMLViewer"

interface ProjectProps {
  id: string
}

interface ProjectState {
  project?: core.Project
}

// TODO: Need to make this component auto-refresh
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
    if (!project) {
      return <Spinner/>
    }
    return (
      <div>
        <h1>{project?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <ProjectSummary project={project}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={project}/>
          </Tab>
          <Tab eventKey="events" title="Events">
            <EventList selector={{projectID: project.metadata.id}}/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedProject(): React.ReactElement {
  const pathParams = useParams()
  return <Project id={pathParams.id || ""}/>
}

interface ProjectSummaryProps {
  project?: core.Project
}

class ProjectSummary extends React.Component<ProjectSummaryProps> {

  render(): React.ReactElement {
    return <Placeholder/>
  }

}
