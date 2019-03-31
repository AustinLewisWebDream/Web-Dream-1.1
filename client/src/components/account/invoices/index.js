import React, { Component } from 'react';
import { connect } from 'react-redux'
import isEmpty from '../../../validation/is-empty';
import AccountInvoice from './accountInvoice';

class InvoicesPage extends Component {
    render() {
        if(isEmpty(this.props.invoices))
            return <h2>No Invoices Yet</h2>
        else {
            let invoices = this.props.invoices.map(invoice => {
                return(
                    <div>
                        <AccountInvoice invoice={invoice} />
                    </div>
                )
            })
            return(
                <div>{invoices}</div>
            )
        }
    }
}
const mapStateToProps = (state) => {
    return {
        invoices: state.auth.user.invoices,
    }
}

export default connect(mapStateToProps)(InvoicesPage)