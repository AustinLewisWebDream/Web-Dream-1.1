import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import classes from 'classnames';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import setAuthToken from '../../setAuthToken';

import { ADD_PAYMENT_METHOD, TEST_HEADER_AUTH } from '../../routes';
import { updateCurrentUser } from '../../actions/authentication';


import './payment.css'

class CardForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardNumber: '',
            exp: '',
            cvc: '',
            primary: false,
        }
        this.updateCardNumber = this.updateCardNumber.bind(this);
        this.submitPaymentInfo = this.submitPaymentInfo.bind(this);
        this.updateForm = this.updateForm.bind(this);
    }
    render() {
        var formattedCardNumber = this.state.cardNumber;
        if(formattedCardNumber.length % 5 === 0) {
            formattedCardNumber += ' ';
        }
        return(
            <React.Fragment>
                <div className='card-form'>
                <TextField
                    label='Card Number'
                    onChange={this.updateCardNumber}
                    className={classes.textField}
                    value={formattedCardNumber}
                    margin={"normal"}
                    fullWidth={true}
                ></TextField>
                
                <TextField
                    label='Exp.'
                    onChange={e => this.updateForm('exp', e)}
                    className={classes.textField}
                    value={this.state.exp}
                    margin={"normal"}
                ></TextField>
                
                <TextField
                    label='CVC'
                    onChange={e => this.updateForm('cvc', e)}
                    className={classes.textField}
                    value={this.state.cvc}
                    margin={"normal"}
                ></TextField>  
                <br></br>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={this.state.primary}
                        onChange={e => this.updatePrimary('primary', e)}
                        value='primary'
                        /> 
                    }
                    label='Make Primary Method'
                />
                <button className='sub-btn' onClick={this.submitPaymentInfo}>Add</button>
                </div>
            </React.Fragment>
        )
    }
    updatePrimary(name, e) { this.setState({ [name]: e.target.checked })}

    updateForm(name, e) { this.setState({ [name]: e.target.value })}

    updateCardNumber(e) {
        var input = e.target.value;
        if(('0123456789'.indexOf(input[input.length - 1]) !== -1) && input.length < 21) {
            this.setState({ cardNumber: input })
        }
        else 
            return;
    }

    async testAuth() {
        setAuthToken();
        // For testing purposes only ----------------
        const response = await fetch(TEST_HEADER_AUTH, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
            })
            })
        
        response.json().then(user => {
            this.props.updateCurrentUser(user)
        })
        // end testing -----------------------
    }
    
    

    async submitPaymentInfo() {
        try {
            const month = this.state.exp.substr(0,2)
            const year = this.state.exp.substr(2, 4)
            const number = this.state.cardNumber.replace(/\s/g, '')
            const res = await fetch(ADD_PAYMENT_METHOD, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
                number: number,
                exp_month: month,
                exp_year: year,
                cvc: this.state.cvc,
                makePrimary: this.state.primary
            })
            })
            const user = await res.json();
            this.props.updateCurrentUser(user)
            this.setState({
                id: this.props.userID,
                cardNumber: '',
                exp: '',
                cvc: '',
                primary: false
            });
        } catch (error) {
            console.log(error)
        }
    }
}
function mapStateToProps(state) {
    return { 
        userID: state.auth.user.id,
        user: state.auth.user
    };
}

export default connect(mapStateToProps, { updateCurrentUser })(CardForm)