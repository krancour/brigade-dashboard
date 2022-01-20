import React from "react"

export default class Box extends React.Component {

  render(): React.ReactElement {
    return <div className="box">{ this.props.children || "" }</div>
  }

}
