import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import config from '../config';
import firebase from '../firebase';
import BookModal from './BookModal';
import BookNavbar from './BookNavbar';

class Bookshelf extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],

            modal: false,
            nestedModal: false,
            closeAll: false,

        };
    }

    componentDidMount() {
        this.getDataFromFirebase();
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

    }

    saveData = (bookName, bookVol, bookPub, bookISBN) => {
        if(this.isEmpty(bookName) 
            || this.isEmpty(bookVol) 
            || this.isEmpty(bookPub) 
            || this.isEmpty(bookISBN)) 
        {
            alert("Fill all field!")
        }
        else {
            console.log(bookName, bookVol, bookPub, bookISBN);
        }
    }

    isEmpty = (string) => {
        return string === "" || string === null || string === undefined;
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
            Nothing to display right now, please come back again.
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
                <BookModal 
                    isOpen={this.state.modal} 
                    isOpenNested={this.state.nestedModal} 
                    toggle={this.toggle} 
                    toggleNested={this.toggleNested}
                    onSave={this.saveData}    
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