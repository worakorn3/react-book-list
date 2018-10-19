import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, Table, Row, Col, Label } from 'reactstrap';
import config from '../config';
import firebase from '../firebase';
import BookModal from './BookModal';
import BookNavbar from './BookNavbar';
import Loader from 'react-loaders';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


class Bookshelf extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            publishers: [],
            selectedRow: null,

            modal: false,
            nestedModal: false,
            closeAll: false,

            loader: true,
        };
    }

    componentDidMount() {
        this.getDataFromFirebase();
        this.setState({
            loader: false
        })
    }

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

        firestore.collection('book_publisher')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc =>
                    this.setState({
                        publishers: this.state.publishers.concat(doc.data())
                    })
                );
            }).catch(function (error) {
                alert("Error getting documents");
            });
    }

    saveData(bookName, bookVol, bookPub, bookISBN) {
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        let obj = {
            "book_name": bookName,
            "book_vol": bookVol,
            "book_pub": bookPub,
            "book_isbn": bookISBN
        }
        firestore.collection("book_shelf").doc(bookISBN).set(obj)
            .then(resp => {
                this.setState({
                    modal: false
                })
                alert("Book Saved! Reloading Page...")
                window.location.reload();
            });
    }

    handleDelete = (row) => {
        console.log(row.book_isbn);
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        firestore.collection('book_shelf').doc(row.book_isbn).delete()
            .then(resp => {
                alert("Delete Success!");
                window.location.reload();
            })
            .catch(err => {
                alert("Delete Failed!", err);
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleNested = () => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        })
    }

    toggleAll = () => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        })
    }

    noContentDisplay() {
        return (<div>
            Nothing to display right now, please come back later.
            </div>)
    }

    render() {

        const columns = [
            {
                dataField: 'book_name',
                text: 'Book Name',
                sort: true
            }, {
                dataField: 'book_vol',
                text: 'Book Volume'
            }, {
                dataField: 'book_isbn',
                text: 'Book ISBN'
            }, {
                dataField: 'book_pub',
                text: 'Book Publisher',
                sort: true
            }
        ];

        const selectRow = {
            mode: 'radio',
            bgColor: 'skyblue',
            clickToSelect: true,
            clickToExpand: true,
            clickToEdit: true,
            onSelect: (row, isSelect, rowIndex, e) => {
                return;
            }
        };

        const expandRow = {
            renderer: row => (
                <Table>
                    <tbody><tr><td><Card><Row><Col>
                        {/*<Label onClick={() => this.handleDelete(row)}><FontAwesomeIcon icon={faTrash} />Delete</Label>*/}
                    </Col></Row></Card></td></tr></tbody>
                </Table>
            ),
            onlyOneExpanding: true
        };

        const defaultSorted = [{
            dataField: 'book_name',
            order: 'asc'
        }];

        const { SearchBar } = Search;

        const pagination = paginationFactory({
            hideSizePerPage: true
        });

        return (
            <div>
                <Modal isOpen={this.state.loader}>
                    <ModalBody>
                        <Loader type="pacman" active={this.state.loader} />
                    </ModalBody>
                </Modal>
                <BookModal
                    isOpen={this.state.modal}
                    isOpenNested={this.state.nestedModal}
                    toggle={this.toggle}
                    toggleNested={this.toggleNested}
                    onSave={this.saveData.bind(this)}
                    dropdown={this.state.publishers}
                    selectedRow={this.state.selectedRow}
                />
                {config.debugMode && <Button onClick={() => (console.log(this.state))}>DEBUG</Button>}
                <Card>
                    <CardHeader>
                        <BookNavbar toggle={this.toggle} />
                    </CardHeader>
                    <CardBody>
                        <ToolkitProvider
                            keyField="book_isbn"
                            data={this.state.books}
                            columns={columns}
                            bootstrap4
                            search
                            exportCSV
                        >
                            {
                                props => (
                                    <div>
                                        <SearchBar
                                            {...props.searchProps}
                                            delay={100}
                                        />
                                        <hr />
                                        <BootstrapTable
                                            {...props.baseProps}
                                            noDataIndication={() => this.noContentDisplay()}
                                            // pagination={paginationFactory()}
                                            pagination={pagination}
                                            striped
                                            hover
                                            defaultSorted={defaultSorted}
                                            selectRow={selectRow}
                                            expandRow={expandRow}
                                        />
                                    </div>
                                )
                            }
                        </ToolkitProvider>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Bookshelf;