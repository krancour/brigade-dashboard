import React from "react"
import { core } from "@brigadecore/brigade-sdk"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faClock, faPlay, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons"

interface JobPhaseIconProps {
  phase?: core.JobPhase
}

export default class JobPhaseIcon extends React.Component<JobPhaseIconProps> {

  render(): React.ReactElement {
    let icon = faQuestion
    switch(this.props.phase) {
      case core.JobPhase.Aborted:
        icon = faTimes
        break
      case core.JobPhase.Canceled:
        icon = faTimes
        break
      case core.JobPhase.Failed:
        icon = faTimes
        break
      case core.JobPhase.Pending:
        icon = faClock
        break
      case core.JobPhase.Running:
        icon = faPlay
        break
      case core.JobPhase.SchedulingFailed:
        icon = faTimes
        break
      case core.JobPhase.Starting:
        icon = faPlay
        break
      case core.JobPhase.Succeeded:
        icon = faCheck
        break
      case core.JobPhase.TimedOut:
        icon = faTimes
        break
    }
    return <FontAwesomeIcon icon={icon}/>
  }

}
