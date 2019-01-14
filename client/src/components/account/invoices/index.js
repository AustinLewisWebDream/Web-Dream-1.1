import React, { Component } from 'react';
import { connect } from 'react-redux'

import isEmpty from '../../../validation/is-empty';
import Invoice from '../../invoice';
import { PAY_INVOICE } from '../../../routes';

const InvoicesPage = props => {
    return (
        <div>
            <List userID={props.userID} invoices={props.invoices}></List>
        </div>

    )
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceID: ''
        }
    }
    render() {
        if(!isEmpty(this.props.invoices)) {
            return(
                this.props.invoices.map(invoice => {
                    const payButton = (
                        <React.Fragment>
                            <button onClick={e => this.payInvoice(e, invoice.invoiceNumber)} className='block-btn small'>Pay Now</button>
                        </React.Fragment>
                    )
                    const date = invoice.dueDate.substring(0, 10);
                    const showMore = (
                        <React.Fragment>
                            <Invoice items={invoice.services}/>
                            {invoice.paid ? null : payButton}
                        </React.Fragment>
                    )
                    return(
                        <React.Fragment>
                            <div key={invoice.id} className='quote-container'>
                                <div className='quote-container-grid'>
                                    <p>Status: <span className={invoice.paid ? 'good' : 'bad'}>{invoice.paid ? 'Paid' : 'Not Paid' }</span></p>
                                    <p>Due Date: <span className='good'>{date}</span></p>
                                    <div></div>
                                    <p onClick={e => this.expandInvoice(invoice.invoiceNumber)} className='standard manage-hosting-link'>Expand<img src='/images/icons/carrot-down.png' alt='Carrot Down Icon' className='dropdown-carrot' /></p>
                                </div>
                                <div>
                                    {this.state.invoiceID == invoice.invoiceNumber ? showMore : null}
                                </div>
                            </div>
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
    payInvoice(e , id) {
        fetch(PAY_INVOICE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
                invoiceID: id
            })
        })
    }

    expandInvoice(id) {
        this.setState({ invoiceID: id })
    }
}

const mapStateToProps = (state) => {
    return {
        invoices: state.auth.user.invoices,
        userID: state.auth.user.id
    }
}

export default connect(mapStateToProps)(InvoicesPage)