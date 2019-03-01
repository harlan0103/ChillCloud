import React, { Component } from 'react';
import './MainPanel.css'

class MainPanel extends Component {
    render() {
        return (
            <div>
                <h3>{ this.props.title }</h3>
            </div>
        );
    }
}

export default MainPanel;