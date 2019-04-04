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
            promoObject: {code: '', description: '', rate: 1,},
            plan: this.props.plan,
            hostingDiscount: this.props.plan.getDiscountItem,
            billingCycle: 'Annually',
            invoiceItems: [],
            usedPromo: false
        }
        this.getUserPromo = this.getUserPromo.bind(this)
        this.generateInvoiceItems = this.generateInvoiceItems.bind(this)
        this.getPromoCodeDiscount = this.getPromoCodeDiscount.bind(this)
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
                label: 'Monthly - $' + this.state.plan.discountedMonthly().toFixed(2) + ' /m'
            },
            {
                value: 'Semi-Annually',
                label: 'Semi-Annually - $' + (this.state.plan.discountedSemiAnnual() / 6).toFixed(2) + ' /m'
            },
            {
                value: 'Annually',
                label: 'Annually - $' + (this.state.plan.discountedAnnual() / 12).toFixed(2) + ' /m'
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
        this.setState({
            invoiceItems: this.generateInvoiceItems(this.state)
        });
        await this.getUserPromo();
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };
    changeBillingCycle = async event => {
        await this.setState((prevState, props) => {
            return {billingCycle: event.target.value, plan: new HostingPlan(prevState.plan.name, event.target.value, 'Renews ' + event.target.value)};
        })
        await this.setState({
            invoiceItems: this.generateInvoiceItems(this.state)
        })
    }
    verifyPromo = async () => {
        if(this.state.usedPromo)
            return;
        try {
            const response = await axios.post(VERIFY_PROMO, {code: this.state.promoCode})
            if(response.data) {
                this.setState({
                    usedPromo : true,
                    promoCode : response.data,
                    errors: []
                })
            }
        } catch (error) {
            this.setState({
                errors: ['Could not find code or code has expired']
            })
        }
    }
    async getUserPromo() {
        if(this.state.usedPromo)
            return;
        try {
            const response = await axios.post(GET_USER_PROMO, {}, {'authorization' : localStorage.getItem('jwtToken')})
            console.log(response.data.data);
            await this.setState({
                promoObject: response.data.data,
                promoCode: response.data.data.code,
                usedPromo : true,
                errors: [],
                
            });
            let newInvoiceItems = this.state.invoiceItems;
            newInvoiceItems.push(this.getPromoCodeDiscount())
            await this.setState({
                invoiceItems: newInvoiceItems
            })
        } catch (error) {
            console.log(error)
        }
    }
    generateInvoiceItems(state) {
        var invoiceItems = [];
        invoiceItems.push(state.plan.getInvoiceItem());
        var discountItem = state.plan.getDiscountItem()
        if(discountItem.price != 0)
            invoiceItems.push(discountItem)
        if(state.usedPromo)
            invoiceItems.push(this.getPromoCodeDiscount());
        return invoiceItems;
    }

    getPromoCodeDiscount() {
        if(this.state.usedPromo) {
            return {name: this.state.promoObject.code, price: (this.state.promoObject.rate * this.state.plan.discountedTotal())*-1, description: this.state.promoObject.description}
        }
        return {name: '', price: 0, description: ''}
    }

    onSubmit = async () => {
        if(isEmpty(this.props.id)) {
            this.props.setRegisterWindow(true);
            return;
        }
        try {
            let body = {
                type: 'hosting',
                name: this.state.plan.name,
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

CheckoutPage.propTypes = {
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {
        id: state.auth.user.id
    }
}

export default withStyles(styles)(connect(mapStateToProps, {setRegisterWindow})(CheckoutPage));
