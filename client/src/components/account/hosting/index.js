import React, { Component } from 'react';
import { connect } from 'react-redux'

import HostingPlans from '../hostingplans';
import Rate from '../monthlyrate';

class HostingPage extends Component {
    render() {
        if(this.props.rate) {
            return (
                <React.Fragment>
                    <div className='account-hosting-grid'>
                        <div>
                            <Rate rate={this.props.rate} />
                        </div>
                        <div>
                            <HostingPlans />
                        </div>
                    </div>
                
                </React.Fragment>
            )
        }
        else {
            return (
                <div>
                    <HostingPlans />
                </div>
            )
        }
    }

}

const mapStateToProps = (state) => {
    return {
        rate: state.auth.user.monthlyRate
    }
}

export default connect(mapStateToProps)(HostingPage)