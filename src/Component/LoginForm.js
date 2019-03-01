// Import from bootstrap
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {
    // This is the constructor of login form component
    constructor(props){
        super(props);

        // Connect handle with loginForm component
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // This is the click respinse function of login form
    handleSubmit(e){

        // preventDefault() 方法组织浏览器进行默认的关联动作
        e.preventDefault();
    }


    render() {
        return (
            <Col md={4} mdOffset={4}>
                <h3>Login</h3>
                <form id="loginForm" onSubmit={this.handleSubmit}>
                    <div class="form-group">
                        <input class="form-control" type="text" placeholder="Email" />
                    </div>
                    <div class="form-group">
                        <input class="form-control" type="password" placeholder="password" />
                    </div>
                    <div class="form-group">
                        <input class="btn btn-primary" id="loginBtn" type="submit" value="Login" />
                    </div>
                </form>
            </Col>
        );
    }
}

// export default means component is used externaly
export default LoginForm;