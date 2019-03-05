import React, { Component } from 'react';
import './MainPanel.css'
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Api from '../Logic/Api';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Alert from 'react-bootstrap/lib/Alert';

import swal from 'sweetalert';

import './MainPanel.css';

class MainPanel extends Component {
    constructor(props){
        super(props);

        this.state = {
            folders: [],
            showAddFolderDialog: false,
            addFolderError: false,

            // For files list
            files: [],
            showUploadFileDialog: false,
            uploadFileError: false,

            // Current selected file
            selectedFolder: '',

        };

        this.addFolder = this.addFolder.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    /**
     * Call the addFolders api with new folder name
     * If backend created database successfully
     * Then close the add folder dialog window
     * And refresh the folder list
     * Otherwise show error message
     */
    addFolder(){
        Api.addFolders(this.newFolderName).then(response => {
            this.setState({
                addFolderError: !response.ok,
            });

            // If add new folder successful
            if(response.ok){
                this.setState({
                    showAddFolderDialog: false
                });
                this.refreshFolderList();
            }
        });
    }

    /**
     * First show the warning message
     * If still want to delete the folder
     * Call Api for deleteFolder with folder name
     * Then refresh folder list
     */
    deleteFolder(folderName){
        swal({
            title: "Delete Folder",
            text: "You will not be able to recover this folder",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelte) => {
            if(willDelte){
                Api.deleteFolder(folderName).then(response => {
                    if(response.ok){
                        swal("Your folder has been deleted", {
                            icon: "success",
                        });
                        // Refresh folder list after delete
                        this.refreshFolderList();
                    }
                });
            }
            else{
                swal("Delete cancel");
            }
        });
    }

    // Get all folders name from database
    refreshFolderList() {
        Api.getFolders()
        .then(response => {
            if (response.ok) {
                response.json()
                .then(responseJson => {
                    // Select first folder as default
                    const firstFolder = responseJson.data[0];

                    // Refresh folder list
                    this.setState({
                        folders: responseJson.data,
                        selectedFolder: firstFolder,
                    }, () => {
                        this.refreshFileList();
                    });
                })
            }
        })
    }

    refreshFileList() {
        // No folder
        if (!this.state.selectedFolder) {
            return;
        }

        Api.getFolder(this.state.selectedFolder.name)
        .then(response => {
            if (response.ok) {
                response.json()
                .then(responseJson => {
                    this.setState({
                        files: responseJson.data.files,
                    });
                })
            }
        })
    }

    changeSelectedFolder(id) {
        // Select current folder
        if (this.state.selectedFolder.id === id) {
            return;
        }

        // Refresh folder name based on the id
        this.setState({
            selectedFolder: this.state.folders.find(x => x.id == id)
        }, () => {
            this.refreshFileList();
        });
    }

    uploadFile() {
        Api.uploadFile(this.state.selectedFolder.name, this.newUploadFile)
        .then(response =>
            {
                this.setState({
                    uploadFileError: !response.ok,
                });

                if (response.ok) {
                    this.setState({
                        showUploadFileDialog: false
                    });
                    this.refreshFileList();
                }
            });
    }

    deleteFile(filename) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                Api.deleteFile(this.state.selectedFolder.name, filename)
                .then(response => {
                    if (response.ok) {
                        swal("Your file has been deleted.", {
                            icon: "success",
                        });

                        this.refreshFileList();
                    }
                });
            } else {
              swal("Your file is safe.");
            }
          });;
    }

    generateDownloadUrl(filename) {
        return Api.generateFileDownloadUrl(this.state.selectedFolder.name, filename);
    }

    // When React creats the page, run refreshFolderList()
    componentDidMount(){
        console.log("Called this function")
        this.refreshFolderList();
    }

    render() {
        var addFolderAlert;
        if(this.state.addFolderError){
            addFolderAlert = (
                <Alert bsStyle='danger'>
                    <strong>Error: </strong>Please check your folder name again.
                </Alert>
            );
        }
        else{
            addFolderAlert = <span></span>;
        }

        const folderList = this.state.folders.map(folder =>
            {
                return (
                <ListGroupItem role="menu" key={folder.id}>
                    <a onClick={() => this.changeSelectedFolder(folder.id)}>
                    <Glyphicon className="folderIcon" glyph='folder-close' />
                    <span className="folderName">{folder.name}</span>
                    </a>
                    <a onClick={() => this.deleteFolder(folder.name)}>
                    <Glyphicon className="removeFolderIcon" glyph='remove' />
                    </a>
                </ListGroupItem>
                )
            });

            const filesList = this.state.files.map(file =>
                {
                    return (
                        <ListGroupItem key={file.id}>
                            <Glyphicon className="fileIcon" glyph='file' />
                            <span className="fileName">{file.filename}</span>
                            <a onClick={() => this.deleteFile(file.filename)}>
                            <Glyphicon className="removeFileIcon" glyph='remove' />
                            </a>
                            <a href={this.generateDownloadUrl(file.filename)}>
                            <Glyphicon className="downloadFileIcon" glyph='download-alt' />
                            </a>
                        </ListGroupItem>
                    );
                });
    
            var uploadFileAlert;
            if (this.state.uploadFileError) {
                uploadFileAlert = (
                    <Alert bsStyle='danger'>
                    <strong>Error: </strong>Please check your file name again.
                    </Alert>
                );
            } else {
                uploadFileAlert = <span></span>;
            }

        return (
            <Row>
                <Col md={4}>
                    <Button id="addFolderButton" onClick={() => this.setState({showAddFolderDialog: true})} bsStyle='primary'>New Folder</Button>
                    <p></p>
                    <ListGroup>
                        {folderList}
                    </ListGroup>

                    <Modal show={this.state.showAddFolderDialog} onHide={() => this.setState({showAddFolderDialog: false})}>
                        <Modal.Header>
                            <Modal.Title>Add folder</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {addFolderAlert}
                            <FormControl type="text" placeholder="Folder Name" onChange={evt => this.newFolderName = evt.target.value} />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => this.setState({showAddFolderDialog: false})}>Close</Button>
                            <Button onClick={this.addFolder} bsStyle="primary">Add</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>

                <Col md={8}>
                    <Button id="uploadFileButton" onClick={() => this.setState({showUploadFileDialog: true})} bsStyle='primary'>Upload File</Button>
                    <p></p>
                    <ListGroup>
                        {filesList}
                    </ListGroup>

                    <Modal show={this.state.showUploadFileDialog} onHide={() => this.setState({showUploadFileDialog: false})}>
                        <Modal.Header>
                            <Modal.Title>Upload File</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {uploadFileAlert}
                            <FormControl type="file" placeholder="Upload file" onChange={evt => this.newUploadFile = evt.target.files[0]} />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => this.setState({showUploadFileDialog: false})}>Close</Button>
                            <Button onClick={this.uploadFile} bsStyle="primary">Add</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        );
    }
}

export default MainPanel;