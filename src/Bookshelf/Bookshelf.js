import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import config from '../config';
import firebase from '../firebase';
import BookModal from './BookModal';
import BookNavbar from './BookNavbar';
import Loader from 'react-loaders';

class Bookshelf extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            publishers: [],

            modal: false,
            nestedModal: false,
            closeAll: false,

            loader: false,
        };
    }

    componentDidMount() {
        this.setState({
            loader: true
        })
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
        console.log("SAVE", bookName, bookVol, bookPub, bookISBN);
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
                <Loader type="pacman" active={this.state.loader} />
                <BookModal
                    isOpen={this.state.modal}
                    isOpenNested={this.state.nestedModal}
                    toggle={this.toggle}
                    toggleNested={this.toggleNested}
                    onSave={this.saveData.bind(this)}
                    dropdown={this.state.publishers}
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