import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class HostingPlans extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        console.log(this.props.subscriptions)
        var hostingPlans = null
        if(this.props.subscriptions) {
            hostingPlans = this.props.subscriptions.map(subscription => {
                const date = subscription.renewDate.substr(8, 2)
                return(
                    <React.Fragment>
                        <div>
                            
                            <div className='segment'>
                                <p className='standard'>{subscription.subscription.name}</p>
                                <p className='standard'>${subscription.subscription.monthly}</p>
                                <p className='good'>Online</p>
                                <p className='standard'>{date}th</p>
                            </div>
                        </div>
                    </React.Fragment>
                )
            });
        }
        console.log()
        if(hostingPlans.length === 0) {
            return (
                <React.Fragment>
                    <h4>You have no hosting plans!</h4>
                    <button class='sub-btn'><NavLink className='no-link-style' to='/get-hosting'>Add Hosting Plan</NavLink></button>
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <div className='subscriptions-container'>
                        <h3>My Hosting Plans</h3>
                        {hostingPlans} 
                    </div>
                           
                </React.Fragment>
            )
        }

    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        subscriptions: state.auth.user.subscriptions
    };
}


export default connect(mapStateToProps)(HostingPlans)