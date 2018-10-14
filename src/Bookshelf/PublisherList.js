import React from 'react';

import {CustomInput} from 'reactstrap';
class PublisherList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publisherList: [],
            publisher: '',
        }
    }

    componentDidMount() {
        this.setState({
            publisherList: this.props.dropdown
        })
    }

    componentWillUnmount() {
        this.setState({
            publisherList: [],
            publisher: ''
        })
    }

    onChange(e) {
        const index = e.target.value;
        const slice = this.state.publisherList.slice();
        const selected = slice[index];
        this.props.onChange("bookPub", selected.publisher_code, selected.publisher_name);
    }

    render() {
        return(
            <div>
                <CustomInput type="select" id="bookPublisher" onChange={this.onChange.bind(this)}>
                    <option value="">-Select-</option>
                    {this.state.publisherList.map((item, index) => (
                        <option 
                            key={index} 
                            value={index}
                            name="publisher"  
                        >{item.publisher_name}</option>
                    ))}
                </CustomInput>
            </div>
        );
    }
}

export default PublisherList;