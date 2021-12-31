import React from "react"
import { Link } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

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

interface EventListProps {}

interface EventListState {
  prevContinueVals: string[]
  currentContinueVal: string,
  events: core.Event[]
  nextContinueVal?: string
}

export default class EventList extends React.Component<EventListProps, EventListState> {

  constructor(props: EventListItemProps) {
    super(props)
    this.state = {
      prevContinueVals: [],
      currentContinueVal: "",
      events: []
    }
  }

  async componentDidMount(): Promise<void> {
    const events = await getClient().core().events().list({}, {
      continue: "",
      limit: eventListPageSize
    })
    this.setState({
      events: events.items,
      nextContinueVal: events.metadata.continue === "" ? undefined : events.metadata.continue
    })
  }

  // TODO: There might be weird state shenanigans that go on here. Refer back
  // to the documentation to see how to handle this.
  fetchPreviousPage = async () => {
    const prevContinueVals = this.state.prevContinueVals
    if (prevContinueVals.length > 0) {
      const currentContinueVal = prevContinueVals.pop() || ""
      const events = await getClient().core().events().list({}, {
        continue: currentContinueVal,
        limit: eventListPageSize
      })
      this.setState({
        prevContinueVals: prevContinueVals,
        currentContinueVal: currentContinueVal,
        events: events.items,
        nextContinueVal: events.metadata.continue === "" ? undefined : events.metadata.continue
      })
    }
  }

  // TODO: There might be weird state shenanigans that go on here. Refer back
  // to the documentation to see how to handle this.
  fetchNextPage = async () => {
    let nextContinueVal = this.state.nextContinueVal
    if (nextContinueVal) {
      const prevContinueVals = this.state.prevContinueVals
      prevContinueVals.push(this.state.currentContinueVal)
      const currentContinueVal = nextContinueVal
      const events = await getClient().core().events().list({}, {
        continue: currentContinueVal,
        limit: eventListPageSize
      })
      this.setState({
        prevContinueVals: prevContinueVals,
        currentContinueVal: currentContinueVal,
        events: events.items,
        nextContinueVal: events.metadata.continue === "" ? undefined : events.metadata.continue
      })
    }
  }

  render(): React.ReactElement {
    const events = this.state.events
    if (events.length == 0) {
      return (
        <div className="box">Stand by...</div>
      )
    }
    const hasPrev = this.state.prevContinueVals.length > 0
    const hasMore = this.state.nextContinueVal ? true : false
    return (
      <div>
        {
          events.map((event: core.Event) => (
            <EventListItem key={event.metadata?.id} event={event}/>
          ))
        }
        { hasPrev && <button onClick={this.fetchPreviousPage}>Previous</button> }
        { hasMore && <button onClick={this.fetchNextPage}>Next</button> }
      </div>
    )
  }

}
