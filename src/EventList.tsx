import React from "react"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface EventListItemProps {
  event: core.Event
}

class EventListItem extends React.Component<EventListItemProps> {
  render(): React.ReactElement {
    return <li>{this.props.event.metadata?.id}</li>
  }
}

interface EventListProps {
  loggedIn: boolean
}

interface EventListState {
  events: core.Event[]
}

export default class EventList extends React.Component<EventListProps, EventListState> {

  constructor(props: EventListProps) {
    super(props)
    this.state = {
      events: []
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      events: (await getClient().core().events().list()).items
    })
  }

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view events.</p>
    }
    const events = this.state.events
    const eventListItems = events.map((event: core.Event) => {
      return <EventListItem event={event}/>
    })
    return <ul>{eventListItems}</ul>
  }

}
