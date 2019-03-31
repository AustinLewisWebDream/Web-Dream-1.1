import React, { Component } from 'react';

import {UPDATE_CUSTOMER_QUOTE} from '../routes';
import axios from 'axios';

class Quote extends Component {
    constructor() {
        super()
        this.state = {
            price: ''
        }
    }
    render() {
        var quotePrice = null
        if (this.props.quote.status == 'Reviewed') {
            quotePrice = (
                (
                    <React.Fragment>
                        <p>{this.props.quote.price}</p>
                    </React.Fragment>
                )
            )
        }
        return(
            <React.Fragment>
                <div className='quote'>
                    <p>{this.props.quote.status}</p>
                    {quotePrice}
                    <p>{this.props.quote.websiteType}</p>
                    <p>{this.props.quote.businessName}</p>
                    <p>{this.props.quote.developmentType}</p>
                    <p>{this.props.quote.goals}</p>
                    <p>{this.props.quote.similarWebsites}</p>
                    <p>{this.props.quote.notes}</p>
                    <div className='quote-control-grid'>
                        <input value={this.state.price} onChange={e => this.changePrice(e)} type='text' placeholder='Price'></input>
                        <button value='Reviewed' onClick={e => this.submittQuote(e)}>Submit</button>
                        <button value='Building' onClick={e => this.submittQuote(e)}>Building</button>
                        <button value='Completed' onClick={e => this.submittQuote(e)} >Completed</button>
                        <button>Delete</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    changePrice(e) {
        this.setState({
            price: e.target.value
        })
    }
    async submittQuote(e) {
        var updatedQuote = this.props.quote;
        if(e.target.value == 'Reviewed') {
            updatedQuote.price = this.state.price;
        }
        updatedQuote.status = e.target.value
        let update = {
            customerID: this.props.customer._id,
            id: this.props.quote._id,
            updated: updatedQuote
        }
        try {
            let res = await axios.post(UPDATE_CUSTOMER_QUOTE, update)
        } catch (error) {
            console.log(error)
        }
        this.setState({
            price: ''
        })
    }
    delete() {
        // TODO: Delete quote
    }

}

export default (Quote)