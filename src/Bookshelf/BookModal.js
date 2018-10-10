import React from 'react';
import { faBook, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Modal, ModalBody, ModalHeader,
    Card, CardBody, CardFooter,
    Label, Input,
    Row, Col,
    Button,
} from 'reactstrap';
import QrReader from 'react-qr-reader';

class BookModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qrDelay: 300,
            result: "Not Found",
            isOpen: false
        };
        this.handleScan.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                result: data
            });
        }
    }

    handleError(err) {

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
                                        <Input type="text" name="bookName" id="bookName" placeholder="Book Name..."></Input>
                                    </Col>
                                    <Col>
                                        <Label>Book Volume:</Label>
                                        <Input type="text" name="bookVol" id="bookVol" placeholder="Book Volmue..."></Input>
                                    </Col>
                                </Row>
                                <hr />
                                <Label>Book Publisher:</Label>
                                <Input type="text" name="bookPub" id="bookPub" placeholder="Book Publisher..."></Input>
                                <hr />
                                <Label>Book ISBN:</Label><FontAwesomeIcon onClick={this.props.toggleNested} icon={faCamera} />
                                <Input type="text" name="bookISBN" id="bookISBN" placeholder="Book ISBN..."></Input>
                            </CardBody>
                            <CardFooter>
                                <center>
                                    <Button style={{ width: "40%" }} color="success" onClick={this.props.onSave}>SAVE</Button>
                                    <Button style={{width: "40%" }} color="secondary" onClick={this.props.toggle}>CANCEL</Button>
                                </center>
                            </CardFooter>
                        </Card>
                        <Modal isOpen={this.props.isOpenNested} toggle={this.props.toggleNested}>
                            <QrReader
                                delay={this.state.qrDelay}
                                onError={this.handleError}
                                onScan={this.handleScan}
                                style={{ width: "100%" }}
                            />
                        </Modal>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default BookModal;