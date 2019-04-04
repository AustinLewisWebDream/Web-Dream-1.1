import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { GET_PLAN_FROM_ID } from '../../routes';
import axios from 'axios'

// TODO: Make this whole file less of a clusterf***

class HostingPlans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedSubscriptions : this.props.subscriptions,
            plans: []
        }
        
    }
    render() {
        var hostingPlans = null
        if(this.props.subscriptions) {
            var updatedSubscriptions = setHostingPlans(this.state.updatedSubscriptions, this.state.plans);
            hostingPlans = updatedSubscriptions.map(subscription => {
                const date = subscription.renewDate.substring(8,10)
                return(
                    <React.Fragment>
                        <div>
                            <div className='segment'>
                                <p className='standard'>{subscription.name}</p>
                                <p className='standard'></p>
                                <p className='good'>Online</p>
                                <p className='standard'>{date}th</p>
                                {/* TODO: <p onClick={e => this.manageHosting(subscription.subscription.name, subscription.renewDate)} className='standard manage-hosting-link'>Manage<img src='/images/icons/carrot-down.png' alt='Open Manage Menu Button' className='dropdown-carrot' /></p> */}
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

    async componentWillMount() {
        let IDs = this.props.subscriptions.map(subIDs => subIDs.subscription)
        let res = await axios.post(GET_PLAN_FROM_ID, {id: IDs })
        this.setState({
            plans: res.data
        })
    }
}

const setHostingPlans = (updatedSubscriptions, plans) => {
    console.log(plans)
    for(var i = 0; i < updatedSubscriptions.length; i++) {
        for(var j = 0; j < plans.length; j++) {
            if(updatedSubscriptions[i].subscription == plans[j]._id) {
                updatedSubscriptions[i].name = plans[j].name;
            }
        }
    }
    return updatedSubscriptions
}

function mapStateToProps(state) {
    console.log(state)
    return {
        subscriptions: state.auth.user.subscriptions
    };
}


export default connect(mapStateToProps)(HostingPlans)