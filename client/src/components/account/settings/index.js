import React from 'react';

import CardForm from '../../payment/cardform';
import PaymentMethods from '../../payment/paymentMethods';
import AutoRenew from '../autorenew';


const Settings = () => {
    return (
        <React.Fragment>
            <AutoRenew />
            <PaymentMethods />
            <CardForm />
        </React.Fragment>
    )
}

export default Settings