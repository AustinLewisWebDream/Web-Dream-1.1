import React from 'react';

const MonthlyRate = (props) => {
    if(props.rate) {
        return (
            <React.Fragment>
                <div className='monthly-rate-container'>
                    <h3>My Monthly Rate</h3>
                    <p className='monthly-rate'>${props.rate} /m</p>
                </div>
            </React.Fragment>
    )}
    else {
        return null
    }
}

export default MonthlyRate
