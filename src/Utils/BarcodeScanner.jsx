import React from 'react';
import Quagga from 'quagga';
import {Button} from 'reactstrap'

class BarcodeScanner extends React.Component {
    constructor(props) {
        super(props);
        this._onDetected = this._onDetected.bind(this);
    }
    componentDidMount() {
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facing: "environment" // or user
                },
                area: {
                    top: "0%",    // top offset
                    right: "0%",  // right offset
                    left: "0%",   // left offset
                    bottom: "0%"  // bottom offset
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 4,
            decoder: {
                readers: ["ean_reader"]
            },
            locate: true
        }, function (err) {
            if (err) {
                return console.log(err);
            }
            Quagga.start();
        });
        Quagga.onDetected(this._onDetected);
    }

    componentWillUnmount() {
        Quagga.offDetected(this._onDetected);
    }

    _onDetected(result) {
        let barcode = result.codeResult.code;
        Quagga.stop();
        this.props.onDetected(barcode);
    }

    render() {
        return (
            <div id="interactive" className="viewport"><Button color="danger" onClick={this.props.toggle}>X</Button>Camera</div>
        )
    }
}

export default BarcodeScanner;