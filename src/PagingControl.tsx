import React from "react"

interface Pageable {
  items: unknown[]
  metadata: {
    continue?: string
  }
}

interface PagingControlProps {}

interface PagingControlState {
  prevContinueVals: string[]
  currentContinueVal: string,
  items: unknown[]
  nextContinueVal?: string
}

export default function withPagingControl(WrappedComponent: typeof React.Component, fetch: (continueVal: string) => Promise<Pageable>): typeof React.Component {

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
      const page = await fetch("")
      this.setState({
        items: page.items,
        nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
      })
    }

    // TODO: There might be weird state shenanigans that go on here. Refer back
    // to the documentation to see how to handle this.
    fetchPreviousPage = async () => {
      const prevContinueVals = this.state.prevContinueVals
      if (prevContinueVals.length > 0) {
        const currentContinueVal = prevContinueVals.pop() || ""
        const page = await fetch(currentContinueVal)
        this.setState({
          prevContinueVals: prevContinueVals,
          currentContinueVal: currentContinueVal,
          items: page.items,
          nextContinueVal: page.metadata.continue === "" ? undefined : page.metadata.continue
        })
      }
    }

    // TODO: There might be weird state shenanigans that go on here. Refer back
    // to the documentation to see how to handle this.
    fetchNextPage = async () => {
      let nextContinueVal = this.state.nextContinueVal
      if (nextContinueVal) {
        const prevContinueVals = this.state.prevContinueVals
        prevContinueVals.push(this.state.currentContinueVal)
        const currentContinueVal = nextContinueVal
        const page = await fetch(currentContinueVal)
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
        return (
          <div className="box">Stand by...</div>
        )
      }
      const hasPrev = this.state.prevContinueVals.length > 0
      const hasMore = this.state.nextContinueVal ? true : false
      return (
        <div>
          <WrappedComponent items={items}/>
          { hasPrev && <button onClick={this.fetchPreviousPage}>Previous</button> }
          { hasMore && <button onClick={this.fetchNextPage}>Next</button> }
        </div>
      )
    }

  }

}
