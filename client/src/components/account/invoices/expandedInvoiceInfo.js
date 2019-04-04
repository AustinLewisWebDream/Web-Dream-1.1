import React, { Component } from 'react';
import PayInvoiceButton from './payInvoiceButton';
import { connect } from 'react-redux'
import { updateCurrentUser } from '../../../actions/authentication'
import Invoice from '../../invoice'
import isEmpty from '../../../validation/is-empty';
import Message from '../../notification/message';
import axios from 'axios';
import { PAY_INVOICE } from '../../../routes';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
      margin: theme.spacing.unit * 2,
    },
  });

class ExpandedInvoiceInfo extends Component {
    constructor() {
        super()
        this.state = {
            badResponse: false,
            notifications: [],
            loading: false,
            paid: true
        }
    }
    render() {
        const { classes } = this.props;
        return(
            <React.Fragment>
                <Invoice items={this.props.invoice.services}/>
                {this.state.paid ? null : <PayInvoiceButton payInvoice={e => this.payInvoice(e, this.props.invoice.invoiceNumber)}/>}     
                <div className='center'>
                    {this.state.loading ? <CircularProgress className={classes.progress} /> : null}
                </div>
                <br></br>
                {isEmpty(this.state.notifications) ? null : <Message type={this.state.badResponse ? 'bad' : 'good'} list={this.state.notifications} />}
            </React.Fragment>
        )
    }
    componentWillMount() {
        this.setState({
            paid: this.props.invoice.paid
        })
    }
    payInvoice = async () => {
        try {
            await this.setState({
                loading: true,
                paid: true
            });
            
            const data = await axios.post(PAY_INVOICE, {invoiceID: this.props.invoice.invoiceNumber}, {'authorization' : localStorage.getItem('jwtToken')})
            this.props.updateCurrentUser(data.data);
            this.setState({
                paid: true,
                loading: false,
                badResponse: false,
                notifications: ['Payment Recieved']
            });
        } catch(err) {
            console.log(err)
            this.setState({
                badResponse: true,
                loading: false,
                paid: false,
                notifications: ['Payment was unable to be processed']
            });
        }
    }
}

ExpandedInvoiceInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default (connect(mapStateToProps, {updateCurrentUser})(withStyles(styles)(ExpandedInvoiceInfo)))