import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import classes from 'classnames';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import setAuthToken from '../../setAuthToken';

import { ADD_PAYMENT_METHOD, TEST_HEADER_AUTH } from '../../routes';
import { updateCurrentUser } from '../../actions/authentication';
import { isValidCardCharacter, isValidCardLength, isBackspaceKey, isValidCVCLength, isValidExpLength } from '../../validation/paymentform';

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
        return(
            <React.Fragment>
                <div className='card-form'>
                <TextField
                    label='Card Number'
                    onKeyDown={this.updateCardNumber}
                    className={classes.textField}
                    value={this.state.cardNumber}
                    margin={"normal"}
                    fullWidth={true}
                ></TextField>
                
                <TextField
                    label='Exp. MMYY'
                    onKeyDown={e => this.updateForm('exp', e)}
                    className={classes.textField}
                    value={this.state.exp}
                    margin={"normal"}
                ></TextField>
                
                <TextField
                    label='CVC'
                    onKeyDown={e => this.updateForm('cvc', e)}
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

    updateForm(name, e) { 
        if(isBackspaceKey(e.keyCode)) {
            const newString = e.target.value.substring(0, e.target.value.length - 1)
            this.setState({
                [name]: newString
            })
            return;
        }
        if(name === 'cvc') {
            if(!isValidCVCLength(e.target.value))
                return;
        } else {
            if(!isValidExpLength(e.target.value))
                return;
        }
        if(!isValidCardCharacter(e.key)){
            return
        }
        this.setState({ [name]: e.target.value+e.key })
    }

    

    updateCardNumber(e) {
        var input = e.target.value;
        var cardLength = this.state.cardNumber+e.key
        cardLength = this.state.cardNumber.replace(/\s/g, '')

        if(isBackspaceKey(e.keyCode)) {
            const newString = cardLength.substring(0, input.length - 1)
            this.setState({
                cardNumber: newString
            })
            return;
        }

        if(isValidCardCharacter(e.key) && isValidCardLength(cardLength)) {
            this.setState({ cardNumber: input+e.key })
        } else {
            
        }
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