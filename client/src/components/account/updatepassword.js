import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Message from '../notification/message';
import isEmpty from '../../validation/is-empty';
import { getUpdatePasswordErrors } from '../../validation/forms'

import { UPDATE_PASSWORD } from '../../routes';


class UpdatePasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatePassword: false,
            oldPassword: '',
            password: '',
            confirmation: '',
            successful: null,
            message: [],
        }
    }
    render() {

        const infoMessage = (
            <React.Fragment>
                <Message type={this.state.successful ? 'good' : 'bad'} list={this.state.message} />
            </React.Fragment>
        )

        const updatePasswordForm = (
            <React.Fragment>
                <TextField
                    id="standard-name"
                    label="Old Password"
                    type="password"
                    value={this.state.oldPassword}
                    onChange={this.handleChange('oldPassword')}
                    margin="normal"
                />
                <TextField
                    id="standard-name"
                    label="New"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                />
                <TextField
                    id="standard-name"
                    label="Confirm"
                    type="password"
                    value={this.state.confirmation}
                    onChange={this.handleChange('confirmation')}
                    margin="normal"
                />
                <button onClick={e => this.handleSubmit(e)} className='block-btn small'>Update</button>
                <br></br>
            </React.Fragment>
        )

        const showFormButton = (
            <React.Fragment>
                <button class='sub-btn' onClick={e => this.showUpdateForm()}>Change Password</button>
            </React.Fragment>
        )

        return (
            <React.Fragment>
                <div>
                <h3>Password</h3>
                <p>********</p>
                  {this.state.updatePassword ? updatePasswordForm : showFormButton}
                  <br></br>
                  {!isEmpty(this.state.message) ? infoMessage : null}
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
        this.setState({ updatePassword: true })
    }
    handleSubmit = async(e) => {
        const user = {
            password: this.state.password,
            passwordConfirmation: this.state.confirmation
        }

        const errors = getUpdatePasswordErrors(user);

        if(!isEmpty(errors)) {
            this.setState({message: errors}, () => {
                return;
            })
        } else {
            const response = await fetch(UPDATE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('jwtToken')
                },
                body: JSON.stringify({
                    id: this.props.userID,
                    oldPassword: this.state.oldPassword,
                    password: this.state.password
                })
            })
            const json = await response.json();
            if(!(response.status === 200)) {
                if(response.status === 500) {
                    this.setState({ messsage: ['Internal server error']})
                    return;
                }

                this.setState({ message: [json.data]})
                return;
            } else {
                this.setState({ 
                    successful: true,
                    message: ['Password Successfully Updated'],
                    updatePassword: false,
                    password: '',
                    confirmation: '',
                    oldPassword: '',
                })
            }
        }
    }
}

function mapStateToProps(state) {

    return {
        email: state.auth.user.email,
        userID: state.auth.user.id
    };
}


export default connect(mapStateToProps)(UpdatePasswordForm)