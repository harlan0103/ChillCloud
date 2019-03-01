import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Navbar from 'react-bootstrap/lib/Navbar';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';

// Import needed component
import LoginForm from './Component/LoginForm';
import MainPanel from './Component/MainPanel';

class App extends Component {

  // This is the constructor for App
  constructor(props) {
    super(props);

    this.state = {
      login: false
    }
  }

 
  render() {
    // Create a variable named content
    var content;

    if (this.state.login == true) {
      content = <MainPanel title="Main Panel"/>;
    }
    else {
      content = <LoginForm />;
    }

    // Add a global navigation bar
    return (
      <Grid>
        <Row>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a id="nav_name" href="/">ChillFatty Cloud</a>
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>
          {content}
        </Row>
      </Grid>
    );
  }

}

export default App;
