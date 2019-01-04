import React, { Component } from 'react';

import './design.css';
import Head from '../genericHead';

class Navbar extends Component {
    render() {
        return (
            <React.Fragment>
                <Head title={'Design'} />
                <h1>This is the design page</h1>
                <ol>
                    <li>Mobile First</li>
                    <li>Link to get a quote</li>
                    <li>Looks fantastic</li>
                </ol>
            </React.Fragment>
        )
    }
}

export default Navbar