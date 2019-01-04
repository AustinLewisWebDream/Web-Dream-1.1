import React, { Component } from 'react';

class Invoice extends Component {
    render() {
        const price = () => {
            var total = 0; 
            for(var i = 0; i < this.props.items.length; i++) {
                total += this.props.items[i].price;
            }
            return (
                <React.Fragment>
                    {total}
                </React.Fragment>
            )
        }


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
                <p>Total: {this.price}</p>

            </React.Fragment>

        )
    }
}

export default Invoice