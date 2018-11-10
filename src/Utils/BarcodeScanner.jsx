import React from 'react';
import Quagga from 'quagga';

class BarcodeScanner extends React.Component {

    componentDidMount() {
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facing: "environment" // or user
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
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
        alert(result)
    }

    render() {
        return (
            <div id="interactive" className="viewport">Camera</div>
        )
    }
}

export default BarcodeScanner;