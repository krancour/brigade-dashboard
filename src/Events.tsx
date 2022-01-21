import React from "react"

import EventList from "./EventList"

export default class Events extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1>All Events</h1>
        <EventList/>
      </div>
    )
  }

}
