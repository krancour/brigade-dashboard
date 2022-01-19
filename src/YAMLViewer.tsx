import React from "react"
import { core } from "@brigadecore/brigade-sdk"
import yaml from "js-yaml"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface YAMLViewerProps {
  object: any
}

export default class YAMLViewer extends React.Component<YAMLViewerProps> {

  render(): React.ReactElement {
    return (
      <div className="box">
        <SyntaxHighlighter language="yaml" style={docco}>
          {yaml.dump(this.props.object)}
        </SyntaxHighlighter>
      </div>
    )
  }

}
