import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import Message from './notification/message'

import './forms.css'

class Login extends Component {

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
        <div>
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
                            <p>Reset Password</p>
                        </div>
                        <Message type={'error'} list={[]} />
                </form>               
            </div>
        </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)