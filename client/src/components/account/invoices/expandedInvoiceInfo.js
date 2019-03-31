import React, { Component } from 'react';
import PayInvoiceButton from './payInvoiceButton';
import { connect } from 'react-redux'
import { updateCurrentUser } from '../../../actions/authentication'
import Invoice from '../../invoice'
import isEmpty from '../../../validation/is-empty';
import Message from '../../notification/message';
import axios from 'axios';
import { PAY_INVOICE } from '../../../routes';

class ExpandedInvoiceInfo extends Component {
    constructor() {
        super()
        this.state = {
            badResponse: false,
            notifications: []
        }
    }
    render() {
        console.log(this.props.invoice)
        return(
            <React.Fragment>
                <Invoice items={this.props.invoice.services}/>
                {this.props.invoice.paid ? null : <PayInvoiceButton onClick={e => this.payInvoice(e, this.props.invoice.invoiceNumber)}/>}                        
                <br></br>
                {isEmpty(this.state.notifications) ? null : <Message type={this.state.badResponse ? 'bad' : 'good'} list={this.state.notifications} />}
            </React.Fragment>
        )
    }
    payInvoice = async () => {
        try {
            const data = axios.post(PAY_INVOICE, {id: this.props.invoice.id}, {'authorization' : localStorage.getItem('jwtToken')})
            updateCurrentUser(data.token);
            this.setState({
                badResponse: false,
                notifications: ['Payment Recieved']
            });
        } catch(err) {
            console.log(err)
            this.setState({
                badResponse: true,
                notifications: ['Payment was unable to be processed']
            });
        }
    }
}

const mapStateToProps = () => {
    return
}

export default connect(mapStateToProps, {updateCurrentUser})(ExpandedInvoiceInfo)