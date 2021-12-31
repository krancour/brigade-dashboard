import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

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
    return (
      <div>
        <div className="box">{project?.metadata.id}</div>
        <div className="box">TODO: Add tabs for YAML/JSON representation and events</div>
      </div>
    )
  }

}

export default function RoutedProject(): React.ReactElement {
  const params: any = useParams()
  return <Project id={params.id}/>
}
