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
import Discount from '../../objects/discount';
import axios from 'axios';
import { ADD_SUBSCRIPTION, VERIFY_PROMO, GET_USER_PROMO } from '../../routes';
import { setRegisterWindow } from '../../actions'
import HostingPlan from '../../objects/hostingplans';

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
    async componentWillMount() {
        if(this.state.usedPromo)
        return;
    try {
        const response = await fetch(GET_USER_PROMO, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: await JSON.stringify({
                id: this.props.id
            })
        })
        const promoCode = await response.json();
        if(response.status != 200) 
            return
        const amountToDiscount = this.state.invoiceItems[0].discountedTotal();
        const discountItem = new Discount(promoCode.data.code, promoCode.data.rate, amountToDiscount);
        const newInvoiceItems = this.state.invoiceItems
        newInvoiceItems.push(discountItem);
        this.setState({
            promoCode: promoCode.data.code,
            usedPromo : true,
            invoiceItems : newInvoiceItems,
            errors: []
        }, () => {
            console.log(this.state.invoiceItems[1].total())
        })
    } catch (error) {
        console.log(error)
    }
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
            newInvoiceItems[0] = new HostingPlan(this.state.invoiceItems[0].name, event.target.value); 
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
            const response = await fetch(VERIFY_PROMO, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: this.state.promoCode
                })
            })
            const promoCode = await response.json();
            if(response.status != 200) 
                throw promoCode
            const amountToDiscount = this.state.invoiceItems[0].discountedTotal();
            const discountItem = new Discount(this.state.promoCode, promoCode.data.rate, amountToDiscount);
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
        if(isEmpty(this.props.id)) {
            this.props.setRegisterWindow(true);
            return;
        }
        try {
            let body = {
                id: this.props.id,
                type: 'hosting',
                name: this.state.invoiceItems[0].name,
                cycle: this.state.billingCycle,
                promo: this.state.promoCode
            }
            await axios.post(ADD_SUBSCRIPTION, body, {'Authorization' : localStorage.getItem('jwtToken')})
            this.props.nextSlide();
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
        id: state.auth.user.id
    }
}

export default withStyles(styles)(connect(mapStateToProps, {setRegisterWindow})(CheckoutPage));
