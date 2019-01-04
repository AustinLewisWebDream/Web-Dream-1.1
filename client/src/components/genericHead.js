import React, { Component } from 'react';

import './genericHead.css';

class Head extends Component {
    render() {
        return (
            <div className='header'>
                <h1>{this.props.title}</h1>
            </div>

        )
    }
}

export default Head