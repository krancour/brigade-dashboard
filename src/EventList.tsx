import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import { core, meta } from "@brigadecore/brigade-sdk"

import moment from "moment"

import getClient from "./Client"
import withPagingControl from "./PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const eventListPageSize = 20

interface EventListItemProps {
  event: core.Event
}

class EventListItem extends React.Component<EventListItemProps> {

  render(): React.ReactElement {
    const event = this.props.event
    return (
      <tr>
        <td>
          <WorkerPhaseIcon phase={event.worker?.status.phase}/>&nbsp;&nbsp;
          <Link to={"/events/" + event.metadata?.id}>{this.props.event.metadata?.id}</Link>
        </td>
        <td><Link to={"/projects/" + event.projectID}>{this.props.event.projectID}</Link></td>
        <td>{this.props.event.source}</td>
        <td>{this.props.event.type}</td>
        <td>{moment(this.props.event.metadata?.created).fromNow(true)}</td>
      </tr>
    )
  }
}

interface EventListProps {
  items: core.Event[]
}

class EventList extends React.Component<EventListProps> {

  render(): React.ReactElement {
    const events = this.props.items
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Project</th>
            <th>Source</th>
            <th>Type</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {
            events.map((event: core.Event) => (
              <EventListItem key={event.metadata?.id} event={event}/>
            ))
          }
        </tbody>
      </Table>
    )
  }

}

export default withPagingControl(EventList, (continueVal: string, selector: core.EventsSelector): Promise<meta.List<core.Event>>  => {
  return getClient().core().events().list(selector, {
    continue: continueVal,
    limit: eventListPageSize
  })
})
