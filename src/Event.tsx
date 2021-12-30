import React from "react"
import { useParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface EventProps {
  loggedIn: boolean
  id: string
}

interface EventState {
  event?: core.Event
}

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

  // TODO: Clear state on unmount?

  render(): React.ReactElement {
    if (!this.props.loggedIn) {
      return <p>Log in to view this event.</p>
    }
    const event = this.state.event
    return (
      <div>
        <div className="box">{event?.metadata?.id}</div>
        <div className="box">TODO: Add tabs for YAML/JSON representation and jobs</div>
      </div>
    )
  }

}

interface RoutedEventProps {
  loggedIn: boolean  
}

export default function RoutedEvent(props: RoutedEventProps): React.ReactElement {
  const params: any = useParams()
  return <Event id={params.id} loggedIn={props.loggedIn}/>
}
