import React, { Component } from 'react';
import TransitionContent from '../inquiry-routes/CSSTransition';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Message from '../notification/message';
import { setRegisterWindow } from '../../actions';
import isEmpty from '../../validation/is-empty';
import PopUp from '../popup/popup'
import CheckoutPage from './checkoutpage';

import './get-hosting.css'
import HostingPlan from '../../objects/hostingplans';

class GetHosting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideNum: 1,
            error: [],
            hostingPlan: 'Business',
            billingCycle: 'Annually',
            plan: new HostingPlan('Starter', 'Annually', 'Renews Annually')
        }
        this.onSlideTransition = this.onSlideTransition.bind(this);
    }
    render() {
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
            <TransitionContent title={'Checkout'}>
                <CheckoutPage 
                    nextSlide={e => this.nextSlide(e)}
                    plan={this.state.plan}
                />
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
    onTypeSelect = name => {
        let description = 'Renews ' + this.state.billingCycle;
        this.setState({ 
            hostingPlan: name,
            plan: new HostingPlan(name, this.state.billingCycle, description),
        });
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };
    nextSlide = e => {
        this.setState({slideNum: this.state.slideNum + 1});
    }
}

function mapStateToProps(state) {
    return {
        userID: state.auth.user.id,
        loginPopup: state.loginPopup
    };
}

export default connect(mapStateToProps, { setRegisterWindow })(GetHosting);
