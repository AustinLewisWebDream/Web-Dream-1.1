import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class AutoRenew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoRenew: this.props.on
        }
        this.saveAutoRenew = this.saveAutoRenew.bind(this)
    }
    render() {
        return (
            <React.Fragment>
            <FormControlLabel
            control={
                <Checkbox
                checked={this.state.autoRenew}
                onChange={e => this.handleInput('autoRenew', e)}
                value='autoRenew'
                /> 
            }
            label='Auto Renew'
            />
            <button className='sub-btn' onClick={this.saveAutoRenew}>Save</button>
            </React.Fragment>

        )
    }
    handleInput(name, e) {
        this.setState({
            [name]: e.target.checked
        })
    }
    saveAutoRenew() {
        fetch('http://localhost:5000/api/users/auto-renew', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.userID,
                autoRenew: this.state.autoRenew,
            })
        })
    }
}

export default AutoRenew