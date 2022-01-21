import yaml from "js-yaml"

import React from "react"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco"

import Box from "./Box"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface YAMLViewerProps {
  object: any
}

export default class YAMLViewer extends React.Component<YAMLViewerProps> {

  render(): React.ReactElement {
    return (
      <Box>
        <SyntaxHighlighter language="yaml" style={docco}>
          {yaml.dump(this.props.object)}
        </SyntaxHighlighter>
      </Box>
    )
  }

}
