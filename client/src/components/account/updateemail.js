import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Message from '../notification/message';
import isEmpty from '../../validation/is-empty';

import { validateEmail } from '../../validation/forms';

import { UPDATE_EMAIL } from '../../routes';

class UpdateEmailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateEmail: false,
            newEmail: '',
            confirmEmail: '',
            message: [],
            badRequest: null,
        }
    }
    render() {

        const errSuccessMessage = (
            <React.Fragment>
                <Message type={this.state.badRequest ? 'bad' : 'good'} list={this.state.message} />
            </React.Fragment>
        )

        const updateEmailForm = (
            <React.Fragment>
                <TextField
                    id="standard-name"
                    label="Email"
                    value={this.state.newEmail}
                    onChange={this.handleChange('newEmail')}
                    margin="normal"
                />
                <TextField
                    id="standard-name"
                    label="Confirm"
                    value={this.state.confirmEmail}
                    onChange={this.handleChange('confirmEmail')}
                    margin="normal"
                />
                <button onClick={e => this.handleSubmit()} className='block-btn small'>Update</button>
                <br></br>
                {!isEmpty(this.state.message) ? errSuccessMessage : null}
            </React.Fragment>
        )

        const updateEmailButton = (
            <React.Fragment>
                <button class='sub-btn' onClick={e => this.showUpdateForm()}>Change Email</button>
            </React.Fragment>
        )

        return (
            <React.Fragment>
                <div className='block-elements'>
                <h3>Email</h3>
                <p>My email: <span className='good'>{this.props.email}</span></p>
                {this.state.updateEmail ? updateEmailForm : updateEmailButton }
                </div>
            </React.Fragment>
        )
    }
    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };
    showUpdateForm () {
        this.setState({ updateEmail: true })
    }
    handleSubmit = async () => {
        const errors = validateEmail(this.state.newEmail)
        if(!isEmpty(errors)) {
            this.setState({
                message: errors,
                badRequest: true
            })
            return;
        }
        if(this.state.newEmail != this.state.confirmEmail) {
            this.setState({ 
                message: ['Emails are not the same'],
                badRequest: true
            })
            return;
        }
        const response = await fetch(UPDATE_EMAIL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
                email:  this.state.newEmail,
                oldEmail: this.props.email
            })
        })
        const json = await response.json();
        if(response.status != 200) {
            this.setState({ 
                message: [json.data], 
                badRequest: true
            })
        } else {
            this.setState({ 
                message: ['Email successfully updated'],
                badRequest: false
            })
        }
    }
}

function mapStateToProps(state) {
    return {
        email: state.auth.user.email,
        userID: state.auth.user.id
    };
}


export default connect(mapStateToProps)(UpdateEmailForm)