import React from "react"
import { Link } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

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
  loggedIn: boolean
}

interface EventListState {
  events: core.Event[]
  continueVal: string
}

export default class EventList extends React.Component<EventListProps, EventListState> {

  constructor(props: EventListProps) {
    super(props)
    this.state = {
      events: [],
      continueVal: ""
    } 
  }

  async componentDidMount(): Promise<void> {
    if (this.props.loggedIn) {
      const events = await getClient().core().events().list({}, {
        continue: "",
        limit: 100
      })
      this.setState({
        events: events.items,
        continueVal: events.metadata.continue || ""
      })
    }
  }

  // TODO: Clear state on unmount?

  fetch = async () => {
    const events = this.state.events
    const continueVal = this.state.continueVal
    const newEvents = await getClient().core().events().list({}, {
      continue: continueVal,
      limit: 20
    })
    this.setState({
      events: events.concat(newEvents.items),
      continueVal: newEvents.metadata.continue || ""
    })
  }

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view events.</p>
    }
    const events = this.state.events
    const hasMore = this.state.continueVal !== ""
    return (
      <div>
        <InfiniteScroll dataLength={this.state.events.length} next={this.fetch} hasMore={hasMore} loader={<h4>Loading...</h4>}>
          {events.map((event: core.Event) => (
            <EventListItem key={event.metadata?.id} event={event}/>
          ))}
        </InfiniteScroll>
      </div>
    )
  }

}
