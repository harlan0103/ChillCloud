import React, { Component } from 'react';
import './MainPanel.css'
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Api from '../Logic/Api';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';


class MainPanel extends Component {
    constructor(props){
        super(props);

        this.state = {
            folders: []
        };
    }

    // Get all folders name from database
    refreshFolderList(){
        Api.getFolders().then(response => {
            if(response.ok){
                response.json().then(responseJson => {
                    this.setState({
                        folders : responseJson.data
                    });
                })
            }
        })
    }

    // When React creats the page, run refreshFolderList()
    componentDidMount(){
        console.log("Called this function")
        this.refreshFolderList();
    }

    render() {
        const folderList = this.state.folders.map(folder => {
            return (
                <ListGroupItem role="menu" key={folder.id}>
                    <a>
                        <Glyphicon className="folderIcon" glyph='folder-close' />
                        <span className="folderName">{folder.name}</span>
                    </a>
                        <a>
                        <Glyphicon className="removeFolderIcon" glyph='remove' />
                    </a>
                </ListGroupItem>
            );
        });
        return (
            <Row>
                <Col md={4}>
                    <ListGroup>
                        {folderList}
                    </ListGroup>
                </Col>
            </Row>
        );
    }
}

export default MainPanel;