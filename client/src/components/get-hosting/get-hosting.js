import React, { Component } from 'react';
import TransitionContent from '../inquiry-routes/CSSTransition'
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Message from '../notification/message'
import Invoice from '../invoice';
import CardForm from '../payment/cardform'
import PaymentMethods from '../payment/paymentMethods'
import { ADD_SUBSCRIPTION } from '../../routes'
import { setRegisterWindow } from '../../actions'
import isEmpty from '../../validation/is-empty';
import PopUp from '../popup/popup'

import './get-hosting.css'

class GetHosting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideNum: 1,
            error: [],
            hostingPlan: null,
        }
        this.onSlideTransition = this.onSlideTransition.bind(this);
    }
    render() {
        const invoiceItems = [
            {
                name: this.state.hostingPlan,
                price: getHostingPrice(this.state.hostingPlan)
            }
        ]

        const chooseHosting = (
            <TransitionContent title={'Hosting Plans'}>
                    <div className='qd-3-grid'>
                        <div>
                            <h3 className='center'>Starter</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>2 Sub Domains</li>
                                <li>50 GB Transfer</li>
                                <li>5GB SSD Storage</li>
                                <li>Free SSL</li>
                            </ul>
                            <h3 className='hosting-price center'>$4 monthly</h3>
                            <h3 onClick={e => this.onTypeSelect('Starter')} className={this.state.hostingPlan === 'Starter' ? 'selected' : 'select'}>Select</h3>
                        </div>
                        <div>
                            <h3 className='center'>Business</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>Unlimited Sub Domains</li>
                                <li>100 GB Transfer</li>
                                <li>10GB SSD Storage</li>
                                <li>Free SSL</li>
                            </ul>
                            <h3 className='hosting-price center'>$8 monthly</h3>
                            <h3 onClick={e => this.onTypeSelect('Business')} className={this.state.hostingPlan === 'Business' ? 'selected' : 'select'}>Select</h3>
                        </div>
                        <div>
                            <h3 className='center'>Hyper</h3>
                            <hr></hr>
                            <ul className='wd-list'>
                                <li>Unlimited Sub Domains</li>
                                <li>Unlimited GB Transfer</li>
                                <li>20GB SSD Storage</li>
                                <li>Free SSL</li>
                            </ul>
                            <h3 className='hosting-price center'>$15 monthly</h3>
                            <h3 onClick={e => this.onTypeSelect('Hyper')} className={this.state.hostingPlan === 'Hyper' ? 'selected' : 'select'}>Select</h3>
                        </div>
                    </div>
                    <div className='res-two-grid control-buttons'>
                        <div></div>
                        <button onClick={this.onSlideTransition} value={1} className='lg-btn'>Next</button>
                    </div>
                </TransitionContent>
        )

        const finishedPage = (
            <TransitionContent title={'All Done!'}>
                <div className='center'>
                    <img src='/images/icons/checkmark.png' alt='Checkmark Icon' />
                    <NavLink className='large-link' to='/account/'><p>Go to My Account<img className='large-link-img' src='/images/icons/right-arrow.png' alt='right arrow' /></p></NavLink>
                </div>
            </TransitionContent>
        )

        const checkout = (
            <TransitionContent>
                <div className='checkout-page'>
                    <div>
                        <h3>Choose a payment method</h3>
                        <div class='grid-segment-3'>
                            <p>Payment methods</p>
                            <PaymentMethods></PaymentMethods>
                            <CardForm></CardForm>
                        </div>
                        <button onClick={e => this.onSubmit(e)} className='block-btn green'>Submit</button>
                    </div>
                    <div className='checkout-invoice'>
                        <Invoice items={invoiceItems}></Invoice>
                    </div>
                </div>
            </TransitionContent>
        )

        const errorMessage = () => {
            if(this.state.error) {
                return (
                    <React.Fragment>
                        <Message type={'error'} list={this.state.error} />
                    </React.Fragment>
                )
            }
            else {
                return null;
            }
            
        }

        const slideMap = [
            {
                content: chooseHosting
            },
            {
                content: checkout
            },
            {
               content: finishedPage
            }
        ];

        return(
            <React.Fragment>
                <PopUp />
            <div className='qd-container'>
                <h1 className='title'>Get Hosting</h1>
                {slideMap[this.state.slideNum - 1].content}
                {errorMessage}
            </div>
            <div className='help-banner'>
                <h3>Need Help?</h3>
                <p>We are happy to help! Just contact austin@webdreamtech.com</p>
            </div>
            </React.Fragment>
            
        )
    }
    componentWillMount() {
        if(isEmpty(this.props.userID)) {
            this.props.setRegisterWindow(true);
        }
    }

    onSlideTransition(e) {
        this.setState({ slideNum: this.state.slideNum + Number(e.target.value) })
    }
    onTypeSelect(name) {
        this.setState({ hostingPlan: name })
    }
    onSubmit() {
        if(isEmpty(this.props.userID)) {
            this.props.setRegisterWindow(true);
            return;
        }

        checkErrors(this.state, this.props.userID, this.props.paymentMethods).then(() => {
            fetch(ADD_SUBSCRIPTION, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('jwtToken')
          },
            body: JSON.stringify({
                id: this.props.userID,
                type: 'hosting',
                name: this.state.hostingPlan
            })
            }).then(response => {
                if(response.ok) {
                    this.setState({slideNum: this.state.slideNum + 1});
                    return;
                }
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                error: true,
                message: err
            });
        })
    }

}

const getHostingPrice = name => {
    if(name === 'Starter') {
        return 4;
    }
    if(name === 'Business') {
        return 8;
    }
    if(name === 'Hyper') {
        return 15;
    } else {
        return 0;
    }
}

function checkErrors(state, user, methods) {
    return new Promise((resolve, reject) => {
        var message = [];
        if(!user) {
            message.push('Please register to checkout');
        }
        if(!methods) {
            message.push('Please add a payment method');
        }
        if(!state.hostingPlan) {
            message.push('Please choose a hosting plan');
        }
        if (message.length === 0) {
            resolve()
        }
        else {
            reject(message)
        }
    })
} 
function mapStateToProps(state) {
    return {
        user: state.auth.user,
        userID: state.auth.user.id,
        paymentMethods: state.auth.user.paymentMethods,
        loginPopup: state.loginPopup
    };
}

export default connect(mapStateToProps, { setRegisterWindow })(GetHosting);
