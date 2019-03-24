import React, { Component } from 'react';

import Customer from './customer';

class CustomerList extends Component {
    render() {
        let customers = this.props.customers.map(customer => {
            return(
                <React.Fragment>
                    <Customer customer={customer} />
                </React.Fragment>
            )
        })
        return(
            <React.Fragment>
                {customers}
            </React.Fragment>
        )
    }
}

export default (CustomerList)