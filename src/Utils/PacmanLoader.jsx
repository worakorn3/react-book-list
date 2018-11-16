import React, {Component} from 'react';
import pacman from '../pacman.svg';
import {Modal} from 'reactstrap';

class Pacman extends Component {
    render() {
        return(
            <Modal isOpen={this.props.isOpen}>
                <img src={pacman} className="loader" alt="loader" />
            </Modal>
        );
    }
}

export default Pacman;