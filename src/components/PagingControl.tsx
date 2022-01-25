import React from "react"

import NextButton from "./NextButton"
import PreviousButton from "./PreviousButton"
import Spinner from "./Spinner"

interface Pageable {
  items: unknown[]
  metadata: {
    continue?: string
  }
}

interface PagingControlProps {
  selector?: any
}

interface PagingControlState {
  prevContinueVals: string[]
  currentContinueVal: string,
  items: unknown[]
  nextContinueVal?: string
}

// TODO: Need to make this thing auto-refresh
export default function withPagingControl(WrappedComponent: typeof React.Component, fetch: (continueVal: string, selector?: any) => Promise<Pageable>): typeof React.Component {

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
      const page = await fetch("", this.props.selector)
      this.setState({
        items: page.items,
        nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
      })
    }

    fetchPreviousPage = async () => {
      const prevContinueVals = this.state.prevContinueVals
      if (prevContinueVals.length > 0) {
        const currentContinueVal = prevContinueVals.pop() || ""
        const page = await fetch(currentContinueVal, this.props.selector)
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
        const page = await fetch(currentContinueVal, this.props.selector)
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
      if (items.length == 0) {
        return <Spinner/>
      }
      const hasPrev = this.state.prevContinueVals.length > 0
      const hasMore = this.state.nextContinueVal ? true : false
      return (
        <div>
          <WrappedComponent items={items}/>
          { hasPrev && <PreviousButton onClick={this.fetchPreviousPage}/> }
          { hasMore && <NextButton onClick={this.fetchNextPage}/> }
        </div>
      )
    }

  }

}
