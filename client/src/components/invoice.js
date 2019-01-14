import React, { Component } from 'react';

class Invoice extends Component {
    render() {

        const total = getTotal(this.props.items);

        const items = this.props.items.map((item) => 
            <React.Fragment>
                <div key={item.name} className='reg-two-grid'>
                    <p key={item.name}>{item.name}</p>
                    <p>{item.price}.00</p>
                </div>
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
                <p>Total: {total}.00</p>

            </React.Fragment>

        )
    }
}

const getTotal = items => {
    var total = 0; 
    for(var i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}

export default Invoice