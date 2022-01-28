import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Card from "react-bootstrap/Card"

export default class ComingSoon extends React.Component {

  render(): React.ReactElement {
    return (
      <Card bg="primary" text="white">
        <Card.Header>
          <FontAwesomeIcon icon={faExclamationTriangle} color="gold"/>
          &nbsp;&nbsp;Coming soon!
        </Card.Header>
        <Card.Body>
          The Brigade API does not yet support this query, but will soon.
        </Card.Body>
      </Card>
    )
  }

}
