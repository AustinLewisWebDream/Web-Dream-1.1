import React from 'react';

import CardForm from '../../payment/cardform';
import PaymentMethods from '../../payment/paymentMethods';
import AutoRenew from '../autorenew';
import UpdatePassword from '../updatepassword';
import UpdateEmail from '../updateemail';


const Settings = () => {
    return (
        <React.Fragment>
            <div>
                <div className='update-account-info-block'>
                    <UpdatePassword />
                    <UpdateEmail />
                </div>
                <div>
                    <AutoRenew />
                </div>
                <div className='account-segment'>
                    <h3>Payment Info</h3>
                    <PaymentMethods />
                    <CardForm />
                </div>

            </div>
        </React.Fragment>
    )
}

export default Settings