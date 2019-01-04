import React , { Component } from 'react';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../actions/authentication';



import './account.css'
import AccountNavigation from './accountnav';

class Account extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <React.Fragment>
                <div className='account-container'>
                    <AccountNavigation />
                    
   
                </div>
            </React.Fragment>
        )
    }
    handleInput(e, name) {
        this.setState({
            [name]: this.state.name
        })
    }

}

function mapStateToProps(state) {
    return {
        userID: state.auth.user.id,
        paymentMethods: state.auth.user.paymentMethods,
        subscriptions: state.auth.user.subscriptions,
        rate: state.auth.user.monthlyRate,
        autoRenew: state.auth.user.autoRenew,
        user: state.auth.user
    };
}


export default connect(mapStateToProps, { updateCurrentUser })(Account)