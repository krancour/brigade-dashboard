import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import yaml from "js-yaml"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"

import getClient from "./Client"
import EventList from "./EventList"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface ProjectProps {
  id: string
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
    if (!project) {
      return <div/>
    }
    return (
      <div>
        <h1>{project?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <ProjectSummary project={project}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <ProjectYAML project={project}/>
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

  constructor(props: ProjectSummaryProps) {
    super(props)
  }

  render(): React.ReactElement {
    return <div className="box">Placeholder</div>
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
    return (
      <div className="box">
        <SyntaxHighlighter language="yaml" style={docco}>
          {yaml.dump(project)}
        </SyntaxHighlighter>
      </div>
    )
  }

}
