import React, { Component } from 'react';
import './MainPanel.css'
import Col from 'react-bootstrap/lib/Col';

class MainPanel extends Component {
    render() {
        return (
            <Col md={4}>
                <h3>{ this.props.title }</h3>
            </Col>
        );
    }
}

export default MainPanel;