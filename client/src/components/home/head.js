import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authentication';
import Message from '../notification/message';
import isEmpty from '../../validation/is-empty';

import './home.css';
import { getRegisterErrors } from '../../validation/forms';

class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password_confirm: '',
            message: [],
            successful: null
        }
        this.updatePassword = this.updatePassword.bind(this);
        this.updateEmail = this.updateEmail.bind(this)
        this.updatePassword_Confirm = this.updatePassword_Confirm.bind(this)
    }
    render() {
        return (
            <div className='head-grid'>
                <div className='header-text-block'>
                    <h1 className='header-text'>Your Dream Website Awaits</h1>
                    <p className='secondary-dark-bg'>Hosting, front-end development, back-end devlopment,
                     and design all at the same place for a great price. 
                    </p>
                </div>
                <div className='center-grid-item'>
                    <div className='field'>
                        <input onChange={this.updateEmail} className='head-input' type='text' placeholder='Email Address' />
                    </div>
                    <div className='field'>
                        <input onChange={this.updatePassword} className='head-input' type='password' placeholder='Password' />
                    </div>
                    <div className='field'>
                        <input onChange={this.updatePassword_Confirm} className='head-input' type='password' placeholder='Confirm Password' />
                    </div>
                    <button onClick={e => this.onSubmit(e)} className='block-btn'>Create Account</button>
                    <br></br>
                    {isEmpty(this.state.message) ? null : <Message type={this.state.successful ? 'good' : 'bad'} list={this.state.message} /> }
                </div>
            </div>
        )
    }
    updatePassword(e) {
        this.setState({ password: e.target.value })
    }
    updatePassword_Confirm(e) {
        this.setState({ password_confirm: e.target.value })
    }
    updateEmail(e) {
        this.setState({ email: e.target.value })
    }
    onSubmit(e) {
        
        e.preventDefault();
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            passwordConfirmation: this.state.password_confirm
        }
        getRegisterErrors(user, errors => {
            if(isEmpty(errors)) {
                
                this.props.registerUser(user, this.props.history);
                this.setState({
                    successful: true,
                    message: ['Account Created'],
                    email: '',
                    password: '',
                    password_confirm: '',
                });
            } else {
                this.setState({
                    successful: false,
                    message: errors
                })
            }
            
        })
        
    }

}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { registerUser })(Head)