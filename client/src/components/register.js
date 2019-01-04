import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../actions/authentication';
import { getRegisterErrors } from '../validation/forms'
import { setLoginWindow, setRegisterWindow } from '../actions'
import Message from './notification/message';

import './forms.css';

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            errors: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.switchToLogin = this.switchToLogin.bind(this);
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
            passwordConfirmation: this.state.password_confirm
        }
        getRegisterErrors(user, (errors) => {
            this.setState({
                errors: errors
            })
            
            if(errors.length == 0)
                this.props.registerUser(user);
        });
    }

    render() {
        return(
            <div className='popup-form'>
                <form onSubmit={ this.handleSubmit }>
                    <h2 className='center'>Register</h2>
                <div className="form-group">
                    <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password_confirm"
                    onChange={ this.handleInputChange }
                    value={ this.state.password_confirm }
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="block-btn">
                        Register
                    </button>
                </div>
                <div className='sub-button-text'>
                    <p onClick={this.switchToLogin}>Already have an account?</p>
                </div>
                <Message type={'error'} list={this.state.errors} />

            </form>
            </div>
        )
    }
    switchToLogin() {
        this.props.setLoginWindow(true);
        this.props.setRegisterWindow(false);
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerUser, setLoginWindow, setRegisterWindow })(withRouter(Register))