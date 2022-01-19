import React from "react"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface LogStreamerProps {
  event: core.Event
  jobName?: string
  containerName?: string
  logKey: string
}

export default class LogStreamer extends React.Component<LogStreamerProps> {

  logStream: any // TODO: https://github.com/brigadecore/brigade-sdk-for-js/issues/55
  logBoxID: string

  constructor(props: LogStreamerProps) {
    super(props)
    this.logBoxID = `${props.logKey}-log-box`
  }

  async componentDidMount(): Promise<void> {
    const logsClient = getClient().core().events().logs()
    const event = this.props.event
    if (event.metadata?.id) {
      alert("Getting log stream")
      this.logStream = logsClient.stream(
        event.metadata?.id, {
          job: this.props.jobName,
          container: this.props.containerName
        },
        {follow: true}
      )
      const logBox = document.getElementById(this.logBoxID)
      if (logBox) {
        this.logStream.onData((logEntry: core.LogEntry) => {  
          logBox.innerHTML += logEntry.message + "<br/>"
        })
      }
    }
  }

  async componentWillUnmount(): Promise<void> {
    if (this.logStream) {
      this.logStream.close()
    }
  }

  render(): React.ReactElement {
    return <div id={this.logBoxID} className="box"/>
  }

}
