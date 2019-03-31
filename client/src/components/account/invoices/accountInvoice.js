import React, { Component } from 'react'
import ExpandedInvoiceInfo from './expandedInvoiceInfo'

class AccountInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        }
    }
    render() {
            const date = this.props.invoice.dueDate.substring(0, 10);
            return(
                <React.Fragment>
                    <div key={this.props.invoice.id} className='quote-container'>
                        <div className='quote-container-grid'>
                            <p>Status: <span className={this.props.invoice.paid ? 'good' : 'bad'}>{this.props.invoice.paid ? 'Paid' : 'Not Paid' }</span></p>
                            <p>Due Date: <span className='good'>{date}</span></p>
                            <div></div>
                            <p 
                                onClick={e => this.expandInvoice(e)} 
                                className='standard manage-hosting-link'>
                                Expand
                                    <img 
                                        src='/images/icons/carrot-down.png' 
                                        alt='Carrot Down Icon' 
                                        className='dropdown-carrot' />
                            </p>
                        </div>
                        <div>
                            {this.state.expanded ? <ExpandedInvoiceInfo invoice={this.props.invoice} /> : null}
                        </div>
                    </div>
                </React.Fragment>
            )
    }
    expandInvoice() {
        this.setState({ expanded: !this.state.expanded })
    }
}

export default AccountInvoice