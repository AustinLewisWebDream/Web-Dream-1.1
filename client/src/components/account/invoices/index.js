import React, { Component } from 'react';
import { connect } from 'react-redux'

import isEmpty from '../../../validation/is-empty';

class InvoicesPage extends Component {
    render() {
        if(!isEmpty(this.props.invoices)) {
            return(
                this.props.invoices.map(invoice => {
                    return(
                        <React.Fragment>
                            <p>This is an invoice</p>
                        </React.Fragment>
                    )
                })
            )
        }
        else {
            return (
                <h2>No Invoices Yet</h2>
            )
            
        }

    }
}

const mapStateToProps = (state) => {
    return {
        invoices: state.auth.user.invoices
    }
}

export default connect(mapStateToProps)(InvoicesPage)