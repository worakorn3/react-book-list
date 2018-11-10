import { faBook, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, CardBody, CardFooter, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import BarcodeScanner from '../Utils/BarcodeScanner';
import PublisherList from './PublisherList';

class BookModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qrDelay: 300,
            result: "Not Found",
            isOpen: false,

            bookName: '',
            bookVol: '',
            bookPub: '',
            bookISBN: ''
        };
        this.handleScan.bind(this);
    }

    handleFieldChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleScan(data) {
        if (data) {
            this.setState({
                result: data
            });
        }
    }

    handleError(err) {

    }

    handleSave = () => {
        this.props.onSave(
            this.state.bookName,
            this.state.bookVol,
            this.state.bookPub,
            this.state.bookISBN
        );
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleDropdown(name, pubCode, pubName) {
        this.setState({
            bookPub: pubName
        })
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                    <ModalHeader>
                        <FontAwesomeIcon icon={faBook} /> New Book
                    </ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Label>Book Name:</Label>
                                        <Input 
                                            value={this.state.bookName} 
                                            type="text" 
                                            name="bookName" 
                                            id="bookName" 
                                            placeholder="Book Name..." 
                                            onChange={e => this.handleChange(e)} />
                                    </Col>
                                    <Col>
                                        <Label>Book Volume:</Label>
                                        <Input type="text" name="bookVol" id="bookVol" placeholder="Book Volmue..." onChange={this.handleChange}></Input>
                                    </Col>
                                </Row>
                                <hr />
                                <Label>Book Publisher:</Label>
                                {/*<Input type="text" name="bookPub" id="bookPub" placeholder="Book Publisher..."></Input>*/}
                                <PublisherList 
                                    dropdown={this.props.dropdown} 
                                    onChange={this.handleDropdown.bind(this)}
                                />
                                <hr />
                                <Label>Book ISBN:</Label><FontAwesomeIcon onClick={this.props.toggleNested} icon={faCamera} />
                                <Input type="text" name="bookISBN" id="bookISBN" placeholder="Book ISBN..." onChange={this.handleChange}></Input>
                            </CardBody>
                            <CardFooter>
                                <center>
                                    <Button 
                                        style={{ width: "40%" }} 
                                        color="success" 
                                        onClick={this.handleSave} 
                                        disabled={(this.state.bookISBN === '' 
                                                    || this.state.bookName === '' 
                                                    || this.state.bookPub === '' 
                                                    || this.state.bookPub === '-Select-' 
                                                    || this.state.bookVol === '')
                                                }
                                    >
                                    SAVE
                                    </Button>
                                    <Button style={{ width: "40%" }} color="secondary" onClick={this.props.toggle}>CANCEL</Button>
                                </center>
                            </CardFooter>
                        </Card>
                        <Modal isOpen={this.props.isOpenNested} toggle={this.props.toggleNested}>
                            <BarcodeScanner />
                        </Modal>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default BookModal;