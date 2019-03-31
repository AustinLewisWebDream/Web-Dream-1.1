import React, { Component } from 'react';

class NotifyAdmin extends Component {
    render() {
        if(this.props.needsAction) {
            return(
                <React.Fragment>
                    <p className='warning admin-warning'>Awaiting Action</p>
                </React.Fragment>
            )
        } else {
            return null
        }
    }
}

export default NotifyAdmin