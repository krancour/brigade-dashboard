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
import LogStreamer from "./LogStreamer"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface EventProps {
  id: string
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
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <EventSummary event={event}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <EventYAML event={event}/>
          </Tab>
          <Tab eventKey="logs" title="Logs">
            <Tabs defaultActiveKey="script" className="mb-3">
              { event.git ? <Tab eventKey="gitInitializer" title="Git Initializer"><LogStreamer event={event} containerName="vcs" logKey="vcs"/></Tab> : null }
              <Tab eventKey="script" title="Script">
                <LogStreamer event={event} logKey={event?.metadata?.id || ""}/>
              </Tab>
            </Tabs>
          </Tab>
          <Tab eventKey="jobs" title="Jobs">
            <JobList event={event}/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedEvent(): React.ReactElement {
  const pathParams = useParams()
  return <Event id={pathParams.id || ""}/>
}

interface EventSummaryProps {
  event?: core.Event
}

class EventSummary extends React.Component<EventSummaryProps> {

  render(): React.ReactElement {
    return <div className="box">Placeholder</div>
  }

}

interface EventYAMLProps {
  event?: core.Event
}

class EventYAML extends React.Component<EventYAMLProps> {

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

interface JobListItemProps {
  job: core.Job
}

class JobListItem extends React.Component<JobListItemProps> {

  render(): React.ReactElement {
    const job = this.props.job
    return (
      <div className="box">
        <h3>{job.name}</h3>

        <Tabs defaultActiveKey={job.name} className="mb-3">
          <Tab eventKey={job.name} title={job.name}>
            Placeholder
          </Tab>
          {
            Object.keys(job.spec.sidecarContainers || {}).map((containerName: string) => (
              <Tab eventKey={containerName} title={containerName}>
                Placeholder
              </Tab>
            ))
          }
        </Tabs>
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
    if (!jobs || jobs.length === 0) {
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
