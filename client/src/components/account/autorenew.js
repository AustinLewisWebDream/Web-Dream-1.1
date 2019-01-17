import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';

import { updateCurrentUser } from '../../actions/authentication';

import { UPDATE_AUTORENEW } from '../../routes';

class AutoRenew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoRenew: this.props.autoRenew
        }
        this.saveAutoRenew = this.saveAutoRenew.bind(this)
    }
    render() {
        var autoRenewText = '';

        if(this.state.autoRenew) 
            autoRenewText = 'On'
        else 
            autoRenewText = 'Off'


        var autoRenewClass = ''

        if(autoRenewText =='On')
            autoRenewClass = 'good'
        if(autoRenewText == 'Off')
            autoRenewClass = 'bad'

        return (
            <React.Fragment>
                <div className='auto-renew-box'>
                    <div>
                        <h3 className='auto-renew-indicator-text'>Auto Renewal: <span className={autoRenewClass}>{autoRenewText}</span></h3>
                    </div>
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                checked={this.state.autoRenew}
                                onChange={e => this.handleInput('autoRenew', e)}
                                value="autoRenew"
                                color="primary"
                                />
                            }
                            label="Auto Renew"
                        />
                        <button className='sub-btn' onClick={this.saveAutoRenew}>Save</button>
                    </div>
                </div>
            </React.Fragment>

        )
    }
    handleInput(name, e) {
        this.setState({
            [name]: e.target.checked
        })
    }
    saveAutoRenew = async() => {
        const response = await fetch(UPDATE_AUTORENEW, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
                autoRenew: this.state.autoRenew,
            })
        })
        const json = await response.json();
        this.props.updateCurrentUser(json);
    }
}

const mapStateToProps = (state) => {
    return {
        autoRenew: state.auth.user.autoRenew,
        userID: state.auth.user.id 
    }
}

export default connect(mapStateToProps, { updateCurrentUser })(AutoRenew)