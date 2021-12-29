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

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view this project.</p>
    }
    const project = this.state.project
    // TODO: I don't love embedding this style here, but we NEED this and it
    // works well enough for now.
    const style = {
      height: 30,
      border: "1px solid green",
      margin: 6,
      padding: 8
    }
    return <div style={style}>{project?.metadata.id}</div>
  }

}

interface RoutedProjectProps {
  loggedIn: boolean  
}

export default function RoutedProject(props: RoutedProjectProps): React.ReactElement {
  const params: any = useParams()
  return <Project id={params.id} loggedIn={props.loggedIn}/>
}
