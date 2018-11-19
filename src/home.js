import React from 'react';
import {
    Card, CardHeader, CardBody,
    Row, Col, Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import BookshelfIcon from './bookshelf-svgrepo-com.svg';

class Home extends React.Component {

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <b>Bookshelf</b>
                    </CardHeader>
                    <Row>
                        <Col>
                            <CardBody>
                                <Link to={"/bookshelf"}>
                                    <Card>
                                        <Button color="success">
                                            <img src={BookshelfIcon} alt="bookshelfIcon"></img>
                                        </Button>
                                    </Card>
                                </Link>
                            </CardBody>
                        </Col>

                        <Col>
                            <CardBody>
                                2
                            </CardBody>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Home;