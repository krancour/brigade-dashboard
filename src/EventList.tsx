import React from "react"
import { Link } from "react-router-dom"
import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./PagingControl"

const eventListPageSize = 10
const itemRefreshInterval = 5000

interface EventListItemProps {
  event: core.Event
}

interface EventListItemState {
  workerPhase?: core.WorkerPhase
}

class EventListItem extends React.Component<EventListItemProps, EventListItemState> {

  timer: any // TODO: This should not be any

  constructor(props: EventListItemProps) {
    super(props)
    this.state = {
      workerPhase: props.event.worker?.status.phase
    }
  }

  refresh = async () => {
    this.setState({
      workerPhase: await (await getClient().core().events().get(this.props.event.metadata?.id || "")).worker?.status.phase
    })
  }

  componentDidMount(): void {
    this.refresh()
    this.timer = setInterval(this.refresh, itemRefreshInterval)
  }

  componentWillUnmount(): void {
    clearInterval(this.timer)
  }

  render(): React.ReactElement {
    const linkTo = "/events/" + this.props.event.metadata?.id
    const status = this.state.workerPhase ? this.state.workerPhase : core.WorkerPhase
    return (
      <div className="box">
        {status}&nbsp;&nbsp;<Link to={linkTo}>{this.props.event.metadata?.id}</Link>
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
