import React from 'react';
import {
    Card, CardHeader, CardBody,
    Row, Col
} from 'reactstrap';
import { Link } from 'react-router-dom';

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
                                        <CardBody>
                                            Bookshelf
                                        </CardBody>
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