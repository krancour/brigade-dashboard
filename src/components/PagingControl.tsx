import React from "react"

import NextButton from "./NextButton"
import PreviousButton from "./PreviousButton"
import Spinner from "./Spinner"

interface Page {
  items: unknown[]
  metadata: {
    continue?: string
  }
}

export interface PagingControlProps {
  items: unknown[]
}

interface PagingControlState {
  prevContinueVals: string[]
  currentContinueVal: string,
  items: unknown[]
  nextContinueVal?: string
}

// TODO: Need to make this thing auto-refresh
export default function withPagingControl(Component: typeof React.Component, fetch: (props: unknown, continueVal: string) => Promise<Page>): typeof React.Component {

  return class extends React.Component<PagingControlProps, PagingControlState> {
    
    constructor(props: PagingControlProps) {
      super(props)
      this.state = {
        prevContinueVals: [],
        currentContinueVal: "",
        items: []
      }
    }

    async componentDidMount(): Promise<void> {
      const page = await fetch(this.props, "")
      this.setState({
        items: page.items,
        nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
      })
    }

    fetchPreviousPage = async () => {
      const prevContinueVals = this.state.prevContinueVals
      if (prevContinueVals.length > 0) {
        const currentContinueVal = prevContinueVals.pop() || ""
        const page = await fetch(this.props, currentContinueVal)
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    fetchNextPage = async () => {
      let nextContinueVal = this.state.nextContinueVal
      if (nextContinueVal) {
        const prevContinueVals = this.state.prevContinueVals
        prevContinueVals.push(this.state.currentContinueVal)
        const currentContinueVal = nextContinueVal
        const page = await fetch(this.props, currentContinueVal)
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    render(): React.ReactElement {
      const items = this.state.items
      if (items.length === 0) {
        return <Spinner/>
      }
      const hasPrev = this.state.prevContinueVals.length > 0
      const hasMore = this.state.nextContinueVal ? true : false
      return (
        <div>
          <Component items={items}/>
          { hasPrev && <PreviousButton onClick={this.fetchPreviousPage}/> }
          { hasMore && <NextButton onClick={this.fetchNextPage}/> }
        </div>
      )
    }

  }

}
