import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import yaml from "js-yaml"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"

import getClient from "./Client"
import LogStreamer from "./LogStreamer"
import WorkerPhaseIcon from "./WorkerPhaseIcon"
import JobPhaseIcon from "./JobPhaseIcon"

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
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <EventSummary event={event}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <EventYAML event={event}/>
          </Tab>
          <Tab eventKey="logs" title="Logs">
            <Tab.Container defaultActiveKey="script">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    { event.git ? <Nav.Item><Nav.Link eventKey="gitInitializer"><WorkerPhaseIcon phase={event.worker?.status.phase}/> Git Initializer</Nav.Link></Nav.Item> : null }
                    <Nav.Item>
                      <Nav.Link eventKey="script"><WorkerPhaseIcon phase={event.worker?.status.phase}/> Script</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    { event.git ? <Tab.Pane eventKey="gitInitializer" mountOnEnter><LogStreamer event={event} containerName="vcs" logKey="vcs"/></Tab.Pane> : null }
                    <Tab.Pane eventKey="script" mountOnEnter>
                      <LogStreamer event={event} logKey={event?.metadata?.id || ""}/>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
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
  event: core.Event
  job: core.Job
}

class JobListItem extends React.Component<JobListItemProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const job = this.props.job
    return (
      <Tabs defaultActiveKey={job.name} className="mb-3" mountOnEnter={true}>
        <Tab eventKey={job.name} title="Primary Container">
          <LogStreamer event={event} jobName={job.name} logKey={job.name}/>
        </Tab>
        {
          Object.keys(job.spec.sidecarContainers || {}).map((containerName: string) => (
            <Tab eventKey={containerName} title={containerName}>
              <LogStreamer event={event} jobName={job.name} containerName={containerName} logKey={`${job.name}-${containerName}`}/>
            </Tab>
          ))
        }
      </Tabs>
    )
  }

}

interface JobListProps {
  event: core.Event
}

class JobList extends React.Component<JobListProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const jobs = event.worker?.jobs
    if (!jobs || jobs.length === 0) {
      return <div className="box">There are no jobs associated with this event.</div>
    }
    const defaultJobName = jobs[0].name
    return (
      <Tab.Container defaultActiveKey={defaultJobName}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {
                jobs.map((job: core.Job) => (
                  <Nav.Item>
                    {/* TODO: Fix use of any below after https://github.com/brigadecore/brigade-sdk-for-js/pull/59 is taken care of and SDK v2.1.0 is released. */}
                    <Nav.Link eventKey={job.name}><JobPhaseIcon phase={(job as any).status?.phase}/> {job.name}</Nav.Link>
                  </Nav.Item>
                ))
              }
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {
                jobs.map((job: core.Job) => (
                  <Tab.Pane eventKey={job.name} mountOnEnter>
                    <JobListItem key={job.name} event={event} job={job}/>
                  </Tab.Pane>
                ))
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }

}
