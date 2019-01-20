import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLoginWindow } from '../actions';
import Message from './notification/message'
import isEmpty from '../validation/is-empty';
import { PASSWORD_RECOVER, PASSWORD_RESET } from '../routes';

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
        this.setState({
            currentForm: 2
        });
        const response = await fetch(PASSWORD_RECOVER, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email
            })
        })
        if(response.status != 200) {
            this.setState({
                currentForm: 1,
                messages: ['User Not Found']
            })
            return
        } 
    }

    submittPasswordChange = async (email) => {
        const response = await fetch(PASSWORD_RESET, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                token: this.state.token
            })
        })
        if(response.status != 200) {
            this.setState({
                token: '',
                password: '',
                confirmPassword: '',
                messages: ['Please ensure the correct token was input']
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
                        {isEmpty(this.state.messages) ? null : <Message type={'error'} list={this.state.messages} />}
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