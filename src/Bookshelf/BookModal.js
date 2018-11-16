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
            isOpen: false,
            bookName: '',
            bookVol: '',
            bookPub: '',
            bookISBN: ''
        };
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

    handleDropdown = (name, pubCode, pubName) => {
        this.setState({
            bookPub: pubName
        })
    }

    handleScannedValue = (isbn) => {
        this.setState({
            bookISBN: isbn
        }, this.props.toggleNested);
    }

    validateIsbn(isbn) {
        let valid = false;
        if(isbn && isbn.length === 13) {
            let checkDigit = parseInt(isbn[12]);
            let sum = 0;
            for(let i = 0; i < isbn.length-1; i++) {
                let modulo = i%2===0? 1:3;
                sum += (parseInt(isbn[i])*modulo);
            }
            let modulo = sum%10;
            valid = modulo===0? true : (10-modulo)===checkDigit
        }
        return valid;
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
                                            onChange={this.handleChange} />
                                    </Col>
                                    <Col>
                                        <Label>Book Volume:</Label>
                                        <Input 
                                            value={this.state.bookVol} 
                                            type="text" 
                                            name="bookVol" 
                                            id="bookVol" 
                                            placeholder="Book Volmue..." 
                                            onChange={this.handleChange} />
                                    </Col>
                                </Row>
                                <hr />
                                <Label>Book Publisher:</Label>
                                <PublisherList 
                                    dropdown={this.props.dropdown} 
                                    onChange={this.handleDropdown}
                                />
                                <hr />
                                <Label>Book ISBN:</Label><FontAwesomeIcon onClick={this.props.toggleNested} icon={faCamera} />
                                <Input 
                                    value={this.state.bookISBN} 
                                    type="text" 
                                    name="bookISBN" 
                                    id="bookISBN" 
                                    placeholder="Book ISBN..." 
                                    onChange={this.handleChange} />
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
                                                    || this.state.bookVol === ''
                                                    || !this.validateIsbn(this.state.bookISBN)
                                                )}
                                    >
                                    SAVE
                                    </Button>
                                    <Button style={{ width: "40%" }} color="secondary" onClick={this.props.toggle}>CANCEL</Button>
                                </center>
                            </CardFooter>
                        </Card>
                        <Modal isOpen={this.props.isOpenNested} toggle={this.props.toggleNested}>
                            <BarcodeScanner onDetected={this.handleScannedValue} toggle={this.props.toggleNested}/>
                        </Modal>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default BookModal;