import React from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"

interface EventProps {
  id: string
  activeTab: string
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

  render(): React.ReactElement {
    const event = this.state.event
    if (!event) {
      return <div/>
    }
    return (
      <div>
        <h1>{event?.metadata?.id}</h1>
        <ul>
          <li><Link to={"/events/" + this.props.id + "?tab=summary"}>Summary</Link></li>
          <li><Link to={"/events/" + this.props.id + "?tab=yaml"}>YAML</Link></li>
        </ul>
        {
          ((): React.ReactElement => {
            switch (this.props.activeTab) {
              case "summary":
              case "":
                return <EventSummary event={event}>Summary</EventSummary>
              case "yaml":
                return <EventYAML event={event}>YAML</EventYAML>
              default:
                return <div/>
            }
          })()
        }
        <h2>Jobs -- TODO: List jobs</h2>
      </div>
    )
  }

}

export default function RoutedEvent(): React.ReactElement {
  const pathParams = useParams()
  const [queryParams] = useSearchParams()
  return <Event id={pathParams.id || ""} activeTab={queryParams.get("tab") || ""}/>
}

interface EventSummaryProps {
  event?: core.Event
}

class EventSummary extends React.Component<EventSummaryProps> {

  constructor(props: EventSummaryProps) {
    super(props)
  }

  render(): React.ReactElement {
    const event = this.props.event
    return <div className="box">{event?.metadata?.id} summary</div>
  }

}

interface EventYAMLProps {
  event?: core.Event
}

class EventYAML extends React.Component<EventYAMLProps> {

  constructor(props: EventYAMLProps) {
    super(props)
  }

  render(): React.ReactElement {
    const event = this.props.event
    return <div className="box">{event?.metadata?.id} YAML</div>
  }

}
