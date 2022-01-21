import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"
import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"

import getClient from "./Client"
import LogStreamer from "./LogStreamer"
import JobPhaseIcon from "./JobPhaseIcon"
import YAMLViewer from "./YAMLViewer"
import Placeholder from "./Placeholder"

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
      return <Spinner animation="border"/>
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
        </Tabs>
        <Tabs defaultActiveKey="worker-logs" className="mb-3" mountOnEnter={true}>
          { event.git ? <Tab eventKey="git-initializer-logs" title="Git Initializer Logs"><LogStreamer event={event} containerName="vcs" logKey="vcs"/></Tab> : null }
          <Tab eventKey="worker-logs" title="Worker Logs">
            <LogStreamer event={event} logKey={event?.metadata?.id || ""}/>
          </Tab>
          <Tab eventKey="jobs" title="Jobs">
            <JobsTabPane event={event}/>
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
    return <Placeholder/>
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
    return (
      <div>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <Placeholder/>
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={job}/>
          </Tab>
        </Tabs>
        <Tabs defaultActiveKey={job.name} className="mb-3" mountOnEnter={true}>
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

interface JobsTabPaneProps {
  event: core.Event
}

class JobsTabPane extends React.Component<JobsTabPaneProps> {

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
                    {/* TODO: Fix use of any below after https://github.com/brigadecore/brigade-sdk-for-js/pull/59 is taken care of and SDK v2.1.0 is released. */}
                    <Nav.Link eventKey={job.name}><JobPhaseIcon phase={(job as any).status?.phase}/>&nbsp;&nbsp;{job.name}</Nav.Link>
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
