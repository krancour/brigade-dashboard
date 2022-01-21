import React from "react"

import { Link } from "react-router-dom"

import { core, meta } from "@brigadecore/brigade-sdk"

import Box from "./Box"
import getClient from "./Client"
import withPagingControl from "./PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const eventListPageSize = 10

interface EventListItemProps {
  event: core.Event
}

class EventListItem extends React.Component<EventListItemProps> {

  render(): React.ReactElement {
    const event = this.props.event
    const linkTo = "/events/" + event.metadata?.id
    return (
      <Box>
        <WorkerPhaseIcon phase={event.worker?.status.phase}/>&nbsp;&nbsp;
        <Link to={linkTo}>{this.props.event.metadata?.id}</Link>
      </Box>
    )
  }
}

interface EventListProps {
  items: core.Event[]
  projectID?: string
}

// TODO: Make this use a table
class EventList extends React.Component<EventListProps> {

  render(): React.ReactElement {
    const events = this.props.items
    return (
      <div>
        {
          events.map((event: core.Event) => (
            <EventListItem key={event.metadata?.id} event={event}/>
          ))
        }
      </div>
    )
  }

}

export default withPagingControl(EventList, (continueVal: string, selector: core.EventsSelector): Promise<meta.List<core.Event>>  => {
  return getClient().core().events().list(selector, {
    continue: continueVal,
    limit: eventListPageSize
  })
})
