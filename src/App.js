import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Api from './Logic/Api';

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

    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    // Get token from cookie
    var token = Cookies.get('token');
    if(token){
      Api.auth(token).then(response => {
        if(response.ok){
          this.setState({ login: true, });
        }
      });
    }
  }

  onLogin(data){
    console.log(data)
    Cookies.set('token', data.token, { expires: 7 });
    this.setState({ login: true, });
  }
 
  render() {
    // Create a variable named content
    var content;

    if (this.state.login == true) {
      content = <MainPanel title="Main Panel"/>;
    }
    else {
      content = <LoginForm onLogin = {this.onLogin}/>;
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
