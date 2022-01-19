import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUnlockAlt } from "@fortawesome/free-solid-svg-icons"

interface LockIconProps {
  locked: boolean
}

export default class LockIcon extends React.Component<LockIconProps> {

  render(): React.ReactElement {
    if (this.props.locked) { 
      return <FontAwesomeIcon icon={faLock}/>
    }
    return <FontAwesomeIcon icon={faUnlockAlt}/>
  }

}
