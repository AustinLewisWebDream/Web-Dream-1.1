import React, { Component } from 'react';
import { connect } from 'react-redux'

import HostingPlans from '../hostingplans';
import MonthlyRate from '../monthlyrate';

class HostingPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className='account-hosting-grid'>
                    <div>
                        <MonthlyRate rate={this.props.rate} />
                    </div>
                    <div>
                        <HostingPlans />
                    </div>
                </div>
 
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        rate: state.auth.user.monthlyRate
    }
}

export default connect(mapStateToProps)(HostingPage)