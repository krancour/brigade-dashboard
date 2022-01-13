import React from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import yaml from "js-yaml"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco"

import getClient from "./Client"
import { LogStreamOptions } from "@brigadecore/brigade-sdk/dist/core"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface EventProps {
  id: string
  activeTab: string
}

interface EventState {
  event?: core.Event
}

class Event extends React.Component<EventProps, EventState> {

  // TODO: Make the event page auto-refresh

  constructor(props: EventProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      event: await getClient().core().events().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const event = this.state.event
    if (!event) {
      return <div/>
    }
    return (
      <div>
        <h1>{event?.metadata?.id}</h1>
        <ul>
          <li><Link to={"/events/" + this.props.id + "?tab=summary"}>Summary</Link></li>
          <li><Link to={"/events/" + this.props.id + "?tab=yaml"}>YAML</Link></li>
          <li><Link to={"/events/" + this.props.id + "?tab=logs"}>Worker Logs</Link></li>
        </ul>
        {
          ((): React.ReactElement => {
            switch (this.props.activeTab) {
              case "summary":
              case "":
                return <EventSummary event={event}/>
              case "yaml":
                return <EventYAML event={event}/>
              case "logs":
                return <WorkerLogs event={event}/>
              default:
                return <div/>
            }
          })()
        }
        <h2>Jobs</h2>
        <JobList event={event}/>
      </div>
    )
  }

}

export default function RoutedEvent(): React.ReactElement {
  const pathParams = useParams()
  const [queryParams] = useSearchParams()
  return <Event id={pathParams.id || ""} activeTab={queryParams.get("tab") || ""}/>
}

interface EventSummaryProps {
  event?: core.Event
}

class EventSummary extends React.Component<EventSummaryProps> {

  constructor(props: EventSummaryProps) {
    super(props)
  }

  render(): React.ReactElement {
    const event = this.props.event
    return <div className="box">{event?.metadata?.id} summary</div>
  }

}

interface EventYAMLProps {
  event?: core.Event
}

class EventYAML extends React.Component<EventYAMLProps> {

  constructor(props: EventYAMLProps) {
    super(props)
  }

  render(): React.ReactElement {
    const event = this.props.event
    return (
      <div className="box">
        <SyntaxHighlighter language="yaml" style={docco}>
          {yaml.dump(event)}
        </SyntaxHighlighter>
      </div>
    )
  }

}

interface WorkerLogsProps {
  event?: core.Event
}

class WorkerLogs extends React.Component<WorkerLogsProps> {

  constructor(props: WorkerLogsProps) {
    super(props)
  }

  async componentDidMount(): Promise<void> {
    const logsClient = getClient().core().events().logs()
    const event = this.props.event
    if (event?.metadata?.id) {
      const logStream = logsClient.stream(event?.metadata?.id, {}, {follow: true})
      const logBox = document.getElementById("logBox")
      // TODO: There could be a memory leak here. Do we need to close the logStream when the component unmounts?
      if (logBox) {
        logStream.onData((logEntry: core.LogEntry) => {  
          logBox.innerHTML += logEntry.message + "<br/>"
        })
      }
    }
  }

  render(): React.ReactElement {
    const event = this.props.event
    return (
      <div>
        <ul>
          <li><Link to="#placeholder">Script</Link></li>
          { event?.git ? <li><Link to="#placeholder">Git Initializer</Link></li> : null }
        </ul>
        <div id="logBox" className="box"/>
      </div>
    )
  }

}

interface JobListItemProps {
  job: core.Job
}

class JobListItem extends React.Component<JobListItemProps> {

  render(): React.ReactElement {
    const job = this.props.job
    return (
      <div className="box">
        <h3>{job.name}</h3>
        <h4>Containers</h4>
        <ul>
          <li><Link to="#placeholder">{job.name}</Link></li>
          {
            Object.keys(job.spec.sidecarContainers || {}).map((containerName: string) => (
              <li><Link to="#placeholder">{containerName}</Link></li>
            ))
          }
        </ul>
      </div>
    )
  }

}

interface JobListProps {
  event: core.Event
}

class JobList extends React.Component<JobListProps> {

  render(): React.ReactElement {
    const jobs = this.props.event?.worker?.jobs
    if (!jobs || jobs.length == 0) {
      return <div className="box">There are no jobs associated with this event.</div>
    }
    return (
      <div>
        {
          jobs.map((job: core.Job) => (
            <JobListItem key={job.name} job={job}/>
          ))
        }
      </div>
    )
  }

}
