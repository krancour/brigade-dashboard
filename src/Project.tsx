import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface ProjectProps {
  loggedIn: boolean
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

  // TODO: Clear state on unmount?

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view this project.</p>
    }
    const project = this.state.project
    return (
      <div>
        <div className="box">{project?.metadata.id}</div>
        <div className="box">TODO: Add tabs for YAML/JSON representation and events</div>
      </div>
    )
  }

}

interface RoutedProjectProps {
  loggedIn: boolean  
}

export default function RoutedProject(props: RoutedProjectProps): React.ReactElement {
  const params: any = useParams()
  return <Project id={params.id} loggedIn={props.loggedIn}/>
}
