import React, { Component } from 'react';

import Quote from './quote';
import NotifyAdmin from '../notifyadmin';

class Customer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            needsAction: false
        }
    }
    
    render() {
        var manageCustomer = null
        if(this.state.expanded) {
            let quotes = this.props.customer.quotes.map(quote => {
                return(
                    <React.Fragment>
                        <Quote quote={quote} customer={this.props.customer}/>
                    </React.Fragment>
                )
            })

            manageCustomer = (
                <React.Fragment>
                    <div className='customer-expanded'>
                        <h3>Quotes</h3>
                        {quotes}
                    </div>
                    
                </React.Fragment>
            ) 
        }
        return(
            <React.Fragment>
                <div onClick={e => this.expandCustomer(e)} className='customer'>
                    <p>{this.props.customer.email}</p>
                    <p>{this.props.customer.status}</p>
                    <p>{this.props.customer.monthlyRate}/m</p>
                    <NotifyAdmin needsAction={this.state.needsAction} />
                </div>
                {manageCustomer}
            </React.Fragment>
        )
    }
    componentWillMount() {
        this.needsAction(this.props.customer.quotes)
    }

    needsAction(quotes) {
        for(var i = 0; i < quotes.length; i++) 
            if(quotes[i].status == 'Accepted' || quotes[i].status == 'Pending' || quotes[i].status == 'Building')
            {
                this.setState({
                    needsAction: true
                })
            }    
    }

    expandCustomer(e) {
        this.setState({expanded : !this.state.expanded});
    }
}

export default (Customer)