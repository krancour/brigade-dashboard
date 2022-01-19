import React from "react"
import { core } from "@brigadecore/brigade-sdk"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faClock, faPlay, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons"

interface WorkerPhaseIconProps {
  phase?: core.WorkerPhase
}

export default class WorkerPhaseIcon extends React.Component<WorkerPhaseIconProps> {

  render(): React.ReactElement {
    let icon = faCheck
    switch(this.props.phase) {
      case core.WorkerPhase.Aborted:
        icon = faCheck
        break
      case core.WorkerPhase.Canceled:
        icon = faCheck
        break
      case core.WorkerPhase.Failed:
        icon = faCheck
        break
      case core.WorkerPhase.Pending:
        icon = faCheck
        break
      case core.WorkerPhase.Running:
        icon = faCheck
        break
      case core.WorkerPhase.SchedulingFailed:
        icon = faCheck
        break
      case core.WorkerPhase.Starting:
        icon = faCheck
        break
      case core.WorkerPhase.Succeeded:
        icon = faCheck
        break
      case core.WorkerPhase.TimedOut:
        icon = faCheck
        break
    }
    return <FontAwesomeIcon icon={icon}/>
  }

}
