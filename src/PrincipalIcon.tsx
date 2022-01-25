import { faQuestion, faServer, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import { authz } from "@brigadecore/brigade-sdk"
import libAuthz from "@brigadecore/brigade-sdk/dist/lib/authz"

interface PrincipalIconProps {
  principalType: libAuthz.PrincipalType
}

export default class PrincipalIcon extends React.Component<PrincipalIconProps> {

  render(): React.ReactElement {
    let icon = faQuestion
    switch(this.props.principalType) {
      case authz.PrincipalTypeServiceAccount:
        icon = faServer
        break
      case authz.PrincipalTypeUser:
        icon = faUser
        break
    }
    return <FontAwesomeIcon icon={icon}/>
  }

}
