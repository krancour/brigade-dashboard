import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const eventListPageSize = 10

interface EventListItemProps {
  event: core.Event
}

class EventListItem extends React.Component<EventListItemProps> {
  render(): React.ReactElement {
    const linkTo = "/events/" + this.props.event.metadata?.id
    return (
      <div className="box">
        <Link to={linkTo}>{this.props.event.metadata?.id}</Link>
      </div>
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

export default withPagingControl(EventList, (continueVal: string): Promise<meta.List<core.Event>>  => {
  return getClient().core().events().list({}, {
    continue: continueVal,
    limit: eventListPageSize
  })
})
