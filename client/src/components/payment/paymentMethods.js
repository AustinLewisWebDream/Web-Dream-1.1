import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateCurrentUser } from '../../actions/authentication';
import { REMOVE_PAYMENT_METHOD } from '../../routes';

import isEmpty from '../../validation/is-empty';

class PaymentMethods extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        if(!isEmpty(this.props.paymentMethods))
        {
            return (
                this.props.paymentMethods.map(method => {
                    // Show indicator of primary payment method
                    var primary = null;
                    if(method.primary) {
                        primary = "Primary"
                    }
                    return(
                        <React.Fragment>
                            <div value={method.number} className='method-segment'>
                                <p>************{method.number}</p>
                                <p className={primary ? 'primary-method' : null}>{primary}</p>
                                <div></div>
                                <img onClick={e => this.deletePaymentMethod(e, method.number)} className='delete-icon' src='/images/icons/trashcan.png' />
                            </div>
                        </React.Fragment>
                    )
                })
            )
        }
        else {
            return (
                <p>No payment methods yet</p>
            )
        }
    }
    deletePaymentMethod(e, number) {
        fetch(REMOVE_PAYMENT_METHOD, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('jwtToken')
        },
        body: JSON.stringify({
            id: this.props.userID,
            number: number
        })
        }).then(response => {
            response.json().then(user => {
                this.props.updateCurrentUser(user);
            })
            
        })
    }
    handleInput(e, name) {
        this.setState({
            [name]: this.state.name
        })
    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        userID: state.auth.user.id,
        paymentMethods: state.auth.user.paymentMethods,
        autoRenew: state.auth.user
    };
}

export default connect(mapStateToProps, { updateCurrentUser })(PaymentMethods)