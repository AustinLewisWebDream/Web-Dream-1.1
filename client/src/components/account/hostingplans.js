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
                const date = subscription.renewDate.substring(8,10)
                return(
                    <React.Fragment>
                        <div>
                            <div className='segment'>
                                <p className='standard'>{subscription.subscription.name}</p>
                                <p className='standard'>${subscription.subscription.monthly}</p>
                                <p className='good'>Online</p>
                                <p className='standard'>{date}th</p>
                                {/* <p onClick={e => this.manageHosting(subscription.subscription.name, subscription.renewDate)} className='standard manage-hosting-link'>Manage<img src='/images/icons/carrot-down.png' alt='Open Manage Menu Button' className='dropdown-carrot' /></p> */}

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
                    <h2>No hosting plans yet</h2>
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
    manageHosting(name, renewDate) {
        console.log(name, renewDate)
    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        subscriptions: state.auth.user.subscriptions
    };
}


export default connect(mapStateToProps)(HostingPlans)