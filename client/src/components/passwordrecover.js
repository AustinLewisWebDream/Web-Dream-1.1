import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLoginWindow } from '../actions';
import Message from './notification/message'
import isEmpty from '../validation/is-empty';
import { PASSWORD_RECOVER, PASSWORD_RESET } from '../routes';
import { getUpdatePasswordErrors } from '../validation/forms';
import axios from 'axios';

import './forms.css'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            token: '',
            messages: [],
            successful: null,
            currentForm: 1
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        try {
            await axios.post(PASSWORD_RECOVER, {email: this.state.email})
            this.setState({
                currentForm: 2,
                messages: [],
                successful: null
            })
        } catch (error) {
            this.setState({
                successful: false,
                messages: [error.response.data.data]
            })
        }        
    }

    submittPasswordChange = async (email) => {
        try {
            const errors = await getUpdatePasswordErrors({password: this.state.password, passwordConfirmation: this.state.confirmPassword})
            if(!isEmpty(errors)) {
                this.setState({
                    messages: errors,
                    successful: false 
                })
                return;
            }
            const response = await axios.post(PASSWORD_RESET, {email: this.state.email, password: this.state.password, token: this.state.token})
            this.setState({
                messages: [response.data.data],
                successful: true,
                password: '',
                confirmPassword: '',
                token: ''
            })
        } catch (error) {
            this.setState({
                messages: [error.response.data.data],
                successful: false
            })
        }
    }

    componentWillMount() {
        this.props.setLoginWindow(false);
    }

    render() {
        const emailForm = (
            <React.Fragment>
                <h2 className='center'>Password Reset</h2>
                <br></br>
                        <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={ this.handleInputChange }
                        value={ this.state.email }
                        />
                        <button onClick={e => this.handleSubmit(e)} type='button' className="block-btn">
                            Submit
                        </button>
                        <br></br>
                        {isEmpty(this.state.messages) ? null : <Message type={'error'} list={this.state.messages} />}
            </React.Fragment>
        )

        const resetForm = (
            <React.Fragment>
                <h2 className='center'>Password Reset</h2>
                <br></br>
                        <input
                        type="text"
                        placeholder="Token"
                        name="token"
                        onChange={ this.handleInputChange }
                        value={ this.state.token }
                        />
                        <input
                        type="password"
                        placeholder="New Password"
                        name="password"
                        onChange={ this.handleInputChange }
                        value={ this.state.password }
                        />
                        <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={ this.handleInputChange }
                        value={ this.state.confirmPassword }
                        />
                        <button onClick={e => this.submittPasswordChange(e)} type='button' className="block-btn">
                            Submit
                        </button>
                        <br></br>
                        {isEmpty(this.state.messages) ? null : <Message type={this.state.successful ? 'good' : 'error'} list={this.state.messages} />}
            </React.Fragment>
        )


        return(
        <div className='login-page-container'>
            <div className='login-border'>
            <div className='popup-form'>
                <form onSubmit={e => this.prevent(e)}>
                    {this.state.currentForm === 2 ? resetForm : emailForm}
                </form>               
            </div>
            </div>
        </div>
        )
    }
    prevent(e) {
        e.preventDefault();
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { setLoginWindow })(LoginPage)