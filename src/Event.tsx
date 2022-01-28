import React from "react"

import Alert from "react-bootstrap/Alert"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"
import Row from "react-bootstrap/Row"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import JobPhaseIcon from "./JobPhaseIcon"
import LogStreamer from "./components/LogStreamer"
import Spinner from "./components/Spinner"
import YAMLViewer from "./components/YAMLViewer"

interface EventProps {
  id: string
}

interface EventState {
  event?: core.Event
}

// TODO: Need to make this component auto-refresh
class Event extends React.Component<EventProps, EventState> {

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
      return <Spinner/>
    }
    return (
      <div>
        <h1>{event?.metadata?.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <EventSummary event={event}/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={event}/>
          </Tab>
          { event.git ? <Tab eventKey="git-initializer-logs" title="Git Initializer Logs"><LogStreamer event={event} containerName="vcs" logKey="vcs"/></Tab> : null }
          <Tab eventKey="worker-logs" title="Worker Logs">
            <LogStreamer event={event} logKey={event?.metadata?.id || ""}/>
          </Tab>
          <Tab eventKey="jobs" title="Jobs">
            <JobTabs event={event}/>
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
    return (
      <Card bg="light">
        <Card.Header>{this.props.event?.metadata?.id}</Card.Header>
        <Card.Body>
          Placeholder
        </Card.Body>
      </Card>
    )
  }

}

interface JobTabsProps {
  event: core.Event
}

class JobTabs extends React.Component<JobTabsProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const jobs = event.worker?.jobs
    if (!jobs || jobs.length === 0) {
      return <Alert variant="primary">There are no jobs associated with this event.</Alert>
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
                    <Nav.Link eventKey={job.name}><JobPhaseIcon phase={job.status?.phase}/>&nbsp;&nbsp;{job.name}</Nav.Link>
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
                    <JobTabPane key={job.name} event={event} job={job}/>
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

interface JobTabPaneProps {
  event: core.Event
  job: core.Job
}

class JobTabPane extends React.Component<JobTabPaneProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const job = this.props.job
    let usesSource = job.spec.primaryContainer.sourceMountPath ? true : false
    if (!usesSource && job.spec.sidecarContainers) {
      Object.keys(job.spec.sidecarContainers).forEach((containerName: string) => {
        if (job.spec.sidecarContainers && job.spec.sidecarContainers[containerName] && job.spec.sidecarContainers[containerName].sourceMountPath) {
          usesSource = true
        }
      })
    }
    return (
      <div>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
          <Card bg="light">
              <Card.Header>{this.props.job.name}</Card.Header>
              <Card.Body>
                Placeholder
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={job}/>
          </Tab>
          { 
            usesSource ? (
              <Tab eventKey="git-initializer-logs" title="Git Initializer Logs">
                <LogStreamer event={event} jobName={job.name} containerName="vcs" logKey="vcs"/>
              </Tab>
            ) : null
          }
          <Tab eventKey={job.name} title="Primary Container Logs">
            <LogStreamer event={event} jobName={job.name} logKey={job.name}/>
          </Tab>
          {
            Object.keys(job.spec.sidecarContainers || {}).map((containerName: string) => (
              <Tab eventKey={containerName} title={`${containerName} logs`}>
                <LogStreamer event={event} jobName={job.name} containerName={containerName} logKey={`${job.name}-${containerName}`}/>
              </Tab>
            ))
          }
        </Tabs>
      </div>
    )
  }

}


