import React, { Component } from 'react';

class Invoice extends Component {

    render() {
        const printItem = item => {
            return (
                <div key={item.name} className='reg-two-grid'>
                    <p key={item.name}>{item.name} - {item.description}</p>
                    <div className='align-right'>
                        <p>${Number(item.price).toFixed(2)}</p>
                    </div>
                </div>
            )
        }
        return(
            <React.Fragment>
                    <h2>Web Dream</h2>
                    <p>1550 Trent Blvd.</p>
                    <p>Lexington, Ky 40515</p>
                    <hr></hr>
                    {this.props.items.map(item => printItem(item))}
                    <hr></hr>
                    <div className='align-right'>
                        <p>Subtotal:  <strong>${getSubtotal(this.props.items).toFixed(2)}</strong></p>
                        <p>Discounts: <strong>${getDiscount(this.props.items).toFixed(2)}</strong></p>
                        <p>Total:     <strong>${getTotal(this.props.items).toFixed(2)}</strong></p>
                    </div>
            </React.Fragment>
        )
    }
}

const getTotal = items => {
    const prices = items.map(item => Number(item.price));
    return prices.reduce((partial_sum, a) => partial_sum + a);
}

const getSubtotal = items => {
    const prices = items.map(item => {
        if(!isDiscount(item)) {
            return Number(item.price)
        } else {
            return 0
        }
    });
    return prices.reduce((partial_sum, a) => partial_sum + a);
}

const getDiscount = items => {
    const prices = items.map(item => {
        if(isDiscount(item)) {
            return Number(item.price)
        } else {
            return 0
        }
    });
    return prices.reduce((partial_sum, a) => partial_sum + a);
}

const isDiscount = item => {
    return Number(item.price) < 0
}

export default Invoice