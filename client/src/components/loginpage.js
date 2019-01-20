import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import Message from './notification/message';
import { NavLink } from 'react-router-dom';

import './forms.css'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }

    render() {
        return(
        <div className='login-page-container'>
            <div className='login-border'>
            <div className='popup-form'>
                <form onSubmit={ this.handleSubmit }>
                <h2 className='center'>Login</h2>
                        <input
                            type="email"
                            placeholder="Email"
                        name="email"
                        onChange={ this.handleInputChange }
                        value={ this.state.email }
                        />

                        <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={ this.handleInputChange }
                        value={ this.state.password }
                        />
                        <button type="submit" className="block-btn">
                            Login
                        </button>
                        <div className='sub-button-text'>
                            <NavLink className='no-link' to='/recover'><p>Reset Password</p></NavLink>
                        </div>
                        <Message type={'error'} list={[]} />
                </form>               
            </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(LoginPage)