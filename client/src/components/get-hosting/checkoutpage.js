import React, { Component } from 'react';
import { connect } from 'react-redux'
import Invoice from '../invoice';
import CardForm from '../payment/cardform';
import PaymentMethods from '../payment/paymentMethods';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Message from '../notification/message';
import isEmpty from '../../validation/is-empty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Item from '../../objects/item';
import Discount from '../../objects/discount';
import Axios from 'axios';
import qs from 'qs'
import { ADD_SUBSCRIPTION, VERIFY_PROMO } from '../../routes';
import { setRegisterWindow } from '../../actions'

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 300,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 600,
    },
});

class CheckoutPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            promoCode: '',
            billingCycle: this.props.billingCycle,
            promotionObject: null,
            invoiceItems: this.props.invoiceItems,
            usedPromo: false
        }
    }
    
    render() {
        const { classes } = this.props;
        const promoForm = (
            <div>
                <TextField
                    id="Promo Code"
                    label="Promo Code"
                    className={classes.textField}
                    value={this.state.promoCode}
                    onChange={this.handleChange('promoCode')}
                    margin="normal"
                    helperText='Enter a promo code'
                />
                <button onClick={e => this.verifyPromo(e)} className='sub-btn'>Add</button>
            </div>
        )

        const chooseBillingPeriodOptions = [
            {
                value: "Monthly",
                label: 'Monthly - $' + this.state.invoiceItems[0].discountedMonthly().toFixed(2) + ' /m'
            },
            {
                value: 'Semi-Annually',
                label: 'Semi-Annually - $' + (this.state.invoiceItems[0].discountedSemiAnnual() / 6).toFixed(2) + ' /m'
            },
            {
                value: 'Annually',
                label: 'Annually - $' + (this.state.invoiceItems[0].discountedAnnual() / 12).toFixed(2) + ' /m'
            },
        ]

        return(
            <React.Fragment>
            <div className='checkout-page'>
                <div>
                    <TextField
                        select
                        label="Select"
                        value={this.state.billingCycle}
                        onChange={e => this.changeBillingCycle(e)}
                        SelectProps={{
                            MenuProps: {
                            className: classes.menu,
                            },
                        }}
                            helperText="Choose a billing cycle"
                            margin="normal"
                        >          {chooseBillingPeriodOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    
                    {this.state.usedPromo ? null : promoForm}

                

                <br></br>
                    {!isEmpty(this.state.errors) ? <Message type={'bad'} list={this.state.errors} /> : null }
                <br></br>
                
                <h3>Choose a payment method</h3>
                <div class='grid-segment-3'>
                    <p>Payment methods</p>
                    <PaymentMethods></PaymentMethods>
                    <CardForm></CardForm>
                </div>
                <button onClick={e => this.onSubmit(e)} className='block-btn'>Submit</button>
                </div>

                <div className='checkout-invoice'>
                    <Invoice items={this.state.invoiceItems}></Invoice>
                </div>
            </div>
        </React.Fragment>
        )
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };
    changeBillingCycle = event => {
        this.setState({
            billingCycle: event.target.value
        }, () => {
            let newInvoiceItems = this.state.invoiceItems;
            newInvoiceItems[0] = new Item(this.state.invoiceItems[0].name, event.target.value); 
            if(newInvoiceItems.length > 1) {
                this.state.invoiceItems[1].amount = newInvoiceItems[0].discountedTotal()
            }
            this.setState({
                invoiceItems: newInvoiceItems
            });
        }
        )
    }
    verifyPromo = async () => {

        if(this.state.usedPromo)
            return;
        try {
            let code = {code: this.state.promoCode};
            const promoCode = await Axios.post('http://localhost:5000/api/user/verify-promo', {code: 'testcode'})

            const amountToDiscount = this.state.invoiceItems[0].discountedTotal();
            const discountItem = new Discount(this.state.promoCode, promoCode.data.data.rate, amountToDiscount);
            const newInvoiceItems = this.state.invoiceItems
            newInvoiceItems.push(discountItem);
            this.setState({
                usedPromo : true,
                invoiceItems : newInvoiceItems,
                errors: []
            }, () => {
                console.log(this.state.invoiceItems[1].total())
            })
        } catch (error) {
            this.setState({
                errors: ['Could not find code or code has expired']
            })
        }
    }
    onSubmit = async () => {
        if(isEmpty(this.props.userID)) {
            this.props.setRegisterWindow(true);
            return;
        }
        try {
            const requestBody = {
                id: this.props.userID,
                type: 'hosting',
                name: this.state.invoiceItems[0].name,
                cycle: this.state.billingCycle,
                promo: this.state.promoCode
            }
            const response = await Axios.post(ADD_SUBSCRIPTION, requestBody, {'authorization' : localStorage.getItem('jwtToken')})
            console.log(response);
        } catch (err) {
            console.log(err)
            this.setState({
                errors: ['An error occurred while proccessing your request']
            });
        }
    }
}

function checkErrors(state, user, methods) {
    return new Promise((resolve, reject) => {
        var message = [];

        if (message.length === 0) {
            resolve()
        }
        else {
            reject(message)
        }
    })
} 

CheckoutPage.propTypes = {
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {

    }
}

export default withStyles(styles)(connect(mapStateToProps, {setRegisterWindow})(CheckoutPage));
