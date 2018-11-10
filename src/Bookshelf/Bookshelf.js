import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import overlayFactory from 'react-bootstrap-table2-overlay';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Loader from 'react-loaders';
import { Button, Card, CardBody, CardHeader, Modal, ModalBody } from 'reactstrap';
import firebase from '../firebase';
import BookModal from './BookModal';
import BookNavbar from './BookNavbar';


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
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);

        firestore.collection('book_shelf')
            .get()
            .then(querySnapshot => {
                this.setState({
                    loader: false
                })
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

    saveData = (bookName, bookVol, bookPub, bookISBN) => {
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        let obj = {
            "book_name": bookName,
            "book_vol": bookVol,
            "book_pub": bookPub,
            "book_isbn": bookISBN
        };
        firestore.collection("book_shelf").doc(bookISBN).set(obj)
            .then(resp => {
                this.setState({
                    modal: false
                });
                alert("Book Saved! Reloading Page...");
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
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    toggleNested = () => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        })
    };

    toggleAll = () => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        })
    };

    noContentDisplay = () => {
        return (<div>
            Nothing to display right now, please come back later.
            </div>)
    }

    tableFormatter = (cell, row, rowIndex, formatExtraData) => {
        return (<div>
                <Button color='info' style={{marginRight: '5%'}}>Edit</Button>
                <Button color='danger'>Delete</Button>
            </div>);
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
            }, {
                dataField: 'action_button',
                text: 'Actions',
                isDummyField: true,
                formatter: this.tableFormatter
            }
        ];

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
                    onSave={this.saveData}
                    dropdown={this.state.publishers}
                    selectedRow={this.state.selectedRow}
                />
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
                                            noDataIndication={this.noContentDisplay}
                                            // pagination={paginationFactory()}
                                            pagination={pagination}
                                            hover
                                            overlay={overlayFactory({spinner: true, background: 'rgba(192,192,192,0.3)'})}
                                            defaultSorted={defaultSorted}
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