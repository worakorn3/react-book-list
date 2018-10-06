import React from 'react';
import config from '../config';
import classnames from 'classnames';

import {
    Card, Button, CardTitle, CardText, CardBody,
    Row, Col, Table, Modal, ModalBody, ModalHeader,
    Form, FormGroup, CustomInput
}
    from 'reactstrap';
import BookNavbar from './BookNavbar';
import firebase from '../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faBook, faBookOpen, faBookReader, faPlus } from '@fortawesome/free-solid-svg-icons';

class Bookshelf extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            books: [],
            query: '',
            isOpen: false,
            
            scanning: false,
            results: [],
        };
    }

    componentDidMount() {
        this.getDataFromFirebase();
    }

    // getDataFromSheet = () => {
    //     let spreadsheetId = config.spreadsheetId;
    //     let apiKey = config.apiKey;
    //     let majorDimension = config.majorDimension;
    //     const API = 'https://sheets.googleapis.com/v4/spreadsheets'
    //         + '/' + spreadsheetId + '/values:batchGet?'
    //         + 'ranges=Sheet1&'
    //         + 'majorDimension=' + majorDimension + '&'
    //         + 'key=' + apiKey;
    //     fetch(API).then(response => {
    //         if (response.ok) {
    //             response.json().then(json => {
    //                 let items = json.valueRanges[0].values;
    //                 console.log(json.valueRanges[0].values);
    //                 this.setState({
    //                     tableHeader: items[0],
    //                 });
    //                 for (let i = 1; i < items.length; i++) {
    //                     this.setState({
    //                         tableContent: this.state.tableContent.concat({
    //                             index: i,
    //                             bookTitle: items[i][0],
    //                             bookVolume: items[i][1],
    //                             bookGenre: items[i][2],
    //                             bookPublisher: items[i][3],
    //                             bookISBN: items[i][4],
    //                             dateAdded: items[i][5],
    //                             dateModified: items[i][6],
    //                         })
    //                     });
    //                 }
    //             })
    //         } else {
    //             alert("Fetching books list failed. Try again later.")
    //         }
    //     });
    // }

    getDataFromFirebase = () => {
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);

        firestore.collection('book_shelf')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc =>
                    this.setState({
                        books: this.state.books.concat(doc.data())
                    })
                );
            }).catch(function (error) {
                alert("Error getting documents");
            });

    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                    <ModalHeader>
                        <FontAwesomeIcon icon={faBook} /> New Book
                    </ModalHeader>
                    <ModalBody>
                        
                        <Form>
                            <CustomInput 
                                id="qrscanner"
                                type="text"
                                disabled={true}
                                value={this.state.result}
                                label="ISBN: "
                            />
                        </Form>
                    </ModalBody>
                </Modal>
                <Button onClick={() => (console.log(this.state))}>DEBUG</Button>
                <BookNavbar isOpen={this.state.isOpen} query={this.state.query} onChange={e => this.handleChange(e)} />
                <Table responsive>
                    <thead>
                        <tr>
                            <th><FontAwesomeIcon icon={faBook} /> #</th>
                            <th><FontAwesomeIcon icon={faBookOpen} /> Book Name</th>
                            <th><FontAwesomeIcon icon={faBookReader} /> Book ISBN</th>
                            <th>Action <Button color="success" onClick={() => { this.setState({ isOpen: !this.state.isOpen }) }}><FontAwesomeIcon icon={faPlus} /> New Book</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map((book, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <th>{book.book_name}</th>
                                <th>{book.book_isbn}</th>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Bookshelf;