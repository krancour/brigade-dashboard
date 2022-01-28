import { faGithub, faSlack, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faBlog, faBook } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import BlogCard from "./BlogCard"

export default class Home extends React.Component {

  render(): React.ReactElement {
    return (
      <Container>
        <Row>
          <Col className="splash">
            <img src="/images/logo.png"/>
          </Col>
        </Row>
        <Row>
          <Col>
            <BlogCard/>
            <Card bg="light">
              <Card.Header>
                Placeholder
              </Card.Header>
              <Card.Body>
                Placeholder
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card bg="light">
              <Card.Header>
                Resources
              </Card.Header>
              <Card.Body>
                <ul className="links">
                  <li>
                    <FontAwesomeIcon icon={faBook}/>
                    &nbsp;&nbsp;
                    <a href="https://docs.brigade.sh/" target="_blank">Documentation</a>
                    <ul>
                      <li>
                        <a href="https://quickstart.brigade.sh/" target="_blank">QuickStart</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faBlog}/>
                    &nbsp;&nbsp;
                    <a href="https://blog.brigade.sh/" target="_blank">Blog</a>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faYoutube}/>
                    &nbsp;&nbsp;
                    <a href="https://youtube.brigade.sh/" target="_blank">YouTube Channel</a>
                    <ul>
                      <li>
                        <a href="https://www.youtube.com/watch?v=VFyvYOjm6zc" target="_blank">Video QuickStart</a>
                      </li>
                      <li>
                        <a href="https://www.youtube.com/playlist?list=PLUfRhEZrmeaSWQCvOSs3bbq1NpbSVCW6v" target="_blank">Brigade in 5 Minutes Series</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faSlack}/>
                    &nbsp;&nbsp;
                    <a href="https://slack.brigade.sh/" target="_blank">Slack Channel</a>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faTwitter}/>
                    &nbsp;&nbsp;
                    <a href="https://twitter.com/brigadecore/" target="_blank">Twitter Channel</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
            <Card bg="light">
              <Card.Header>
                Contribute
              </Card.Header>
              <Card.Body>
                <ul className="links">
                  <li>
                    <FontAwesomeIcon icon={faGithub}/>
                    &nbsp;&nbsp;
                    <a href="https://github.com/brigadecore" target="_blank">Check us out on GitHub!</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

}
