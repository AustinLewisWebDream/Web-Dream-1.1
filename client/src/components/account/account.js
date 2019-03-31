import React , { Component } from 'react';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../actions/authentication';
import './account.css'
import AccountNavigation from './accountnav';
import { GET_USER } from '../../routes';

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
    async componentWillMount() {
        const response = await fetch(GET_USER, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id: this.props.userID,
            })
        })

            const json = await response.json();
            this.props.updateCurrentUser(json);
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