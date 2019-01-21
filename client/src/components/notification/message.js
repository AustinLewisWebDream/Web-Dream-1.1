import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetServerErrors } from '../../actions/authentication'

import './message.css';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        var messages = this.props.list;

        if(this.props.errors) {
            messages = this.props.list.concat(this.props.errors)
        }

        const messageList = messages.map(message => {
            return (
                <React.Fragment>
                    <p>{message}</p>
                </React.Fragment>
            )
        })
        
        if(!this.props.errors && !this.props.list) {
            return(
                null
            )
        }
        else {
            return(
                <React.Fragment>
                    <div className='center-message'>
                        <div className='message'>
                            <div className={this.props.type}>
                                {messageList}
                            </div>
                        </div>
                    </div>

                </React.Fragment>
            )
        }
    }

    componentWillUnmount() {
        this.props.resetServerErrors();
    }
}

function mapStateToProps(state) {
    return { 
        errors: state.errors
    };
}

export default connect(mapStateToProps, { resetServerErrors })(Message)