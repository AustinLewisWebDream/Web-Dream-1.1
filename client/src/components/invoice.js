import React, { Component } from 'react';

class Invoice extends Component {
    render() {

        const total = getTotal(this.props.items);
        const discount = total.subtotal - total.final
        
        const printItem = item => {
            return (
                <div key={item.name} className='reg-two-grid'>
                    <p key={item.name}>{item.name} Hosting - Renews {item.cycle}</p>
                    <div className='align-right'>
                        <p>${item.total().toFixed(2)}</p>
                    </div>
                </div>
            )
        }

        const printDiscount = item => {
            return(
                <div key={discount.name} className='reg-two-grid'>
                <p key={item.name}>{item.name} - {item.rate * 100}% off total order</p>
                <div className='align-right'>
                    <p>${item.total().toFixed(2)}</p>
                </div>
            </div>
            )
        }

        const items = this.props.items.map((item) => 
            <React.Fragment>
                {(!item.isDiscount()) ? printItem(item) : printDiscount(item)}
            </React.Fragment>
        );

        return(
            <React.Fragment>
                    <h2>Web Dream</h2>
                    <p>1550 Trent Blvd.</p>
                    <p>Lexington, Ky 40515</p>
                    <hr></hr>
                    {items}
                    <hr></hr>
                    <div className='align-right'>
                        <p>Subtotal: <strong>${total.subtotal.toFixed(2)}</strong></p>
                        <p>Discounts: <strong>$-{discount.toFixed(2)}</strong></p>
                        <p>Total: <strong>${total.final.toFixed(2)}</strong></p>
                    </div>
            </React.Fragment>

        )
    }
}

const getTotal = items => {
    var total = 0; 
    var subtotal = 0;
    for(var i = 0; i < items.length; i++) {
        console.log(items[i])
        if(items[i].isDiscount()){
            total += items[i].discountedTotal();
            continue;
        }
        total += items[i].discountedTotal();
        subtotal += items[i].total();
    }
    return {final: total, subtotal};
}

export default Invoice