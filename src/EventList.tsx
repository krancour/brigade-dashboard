import React from "react"
import { core } from "@brigadecore/brigade-sdk"
import InfiniteScroll from "react-infinite-scroll-component"

import getClient from "./Client"

interface EventListItemProps {
  event: core.Event
}

class EventListItem extends React.Component<EventListItemProps> {
  render(): React.ReactElement {
    // TODO: I don't love embedding this style here, but we NEED this and it
    // works well enough for now.
    const style = {
      height: 30,
      border: "1px solid green",
      margin: 6,
      padding: 8
    }
    return <div style={style}>{this.props.event.metadata?.id}</div>
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
    const hasMore = this.state.continueVal != ""
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
