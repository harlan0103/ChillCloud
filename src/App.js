import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Import needed component
import LoginForm from './Component/LoginForm';
import MainPanel from './Component/MainPanel';

class App extends Component {

  // This is the constructor for App
  constructor(props) {
    super(props);

    this.state = {
      login: true
    }

    // We bind the switch button and the App component
    this.switchOnClick = this.switchOnClick.bind(this);
  }

  // We have a switch button to switch content
  // By click this button will change the this.state.login value
  switchOnClick() {
    this.setState({
      login: !this.state.login
    })
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

    return (
      <div>
        <button onClick={this.switchOnClick}>switch</button>
        {content}
      </div>
    );
  }

}

export default App;
