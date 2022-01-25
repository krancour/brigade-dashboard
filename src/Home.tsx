import React from "react"

import logo from "./assets/logo.png"

export default class Home extends React.Component {

  render(): React.ReactElement {
    return (
      <div className="splash">
        <img src={logo}/>
      </div>
    )
  }

}
