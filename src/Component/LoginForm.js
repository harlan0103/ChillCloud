// Import from bootstrap
import Col from 'react-bootstrap/lib/Col';
import Alert from 'react-bootstrap/lib/Alert';
import Api from '../Logic/Api';
import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {
    // This is the constructor of login form component
    constructor(props){
        super(props);

        this.state = {
            error: false
            
        }

        // Connect handle with loginForm component
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Function call api login function using email and password as params
     * Then get the response from api
     * If email and pwd are correct then set login success response
     * @param {*} e 
     */
    handleSubmit(e){
        // preventDefault() prevent the default action of browser
        e.preventDefault();
        const email = this.email;
        const password = this.password;

        Api.login(email, password).then(response => {
            if(!response.ok){
                // Login fail set login state as false
                this.setState({ error: true });
                return;
            }
            // Login successful
            response.json().then(data => this.props.onLogin(data));
        });
    }

    /**
     * First check if login state is error
     * If error, set alert message
     * 
     */
    render() {
        var alert;
        // If login failed
        if (this.state.error){
            alert = (
                <Alert bsStyle='danger'>
                    <strong>Error: </strong> Wrong email or password
                </Alert>
            );
        }
        else{
            alert = <span></span>
        }

        return (
            <Col md={4} mdOffset={4}>
                <h3>Login</h3>
                {alert}
                <form id="loginForm" onSubmit={this.handleSubmit}>
                    <div class="form-group">
                        <input class="form-control" type="text" placeholder="Email" onChange={evt => this.email = evt.target.value} />
                    </div>
                    <div class="form-group">
                        <input class="form-control" type="password" placeholder="password" onChange={evt => this.password = evt.target.value}/>
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