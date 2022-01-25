import { faCheck, faClock, faPlay, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Spinner from "react-bootstrap/Spinner"

import { core } from "@brigadecore/brigade-sdk"

interface WorkerPhaseIconProps {
  phase?: core.WorkerPhase | null
}

export default class WorkerPhaseIcon extends React.Component<WorkerPhaseIconProps> {

  render(): React.ReactElement {
    if (this.props.phase === undefined) {
      return <Spinner animation="border" size="sm"/>
    }
    let icon = faQuestion
    switch(this.props.phase) {
      case core.WorkerPhase.Aborted:
        icon = faTimes
        break
      case core.WorkerPhase.Canceled:
        icon = faTimes
        break
      case core.WorkerPhase.Failed:
        icon = faTimes
        break
      case core.WorkerPhase.Pending:
        icon = faClock
        break
      case core.WorkerPhase.Running:
        icon = faPlay
        break
      case core.WorkerPhase.SchedulingFailed:
        icon = faTimes
        break
      case core.WorkerPhase.Starting:
        icon = faPlay
        break
      case core.WorkerPhase.Succeeded:
        icon = faCheck
        break
      case core.WorkerPhase.TimedOut:
        icon = faTimes
        break
    }
    return <FontAwesomeIcon icon={icon}/>
  }

}
