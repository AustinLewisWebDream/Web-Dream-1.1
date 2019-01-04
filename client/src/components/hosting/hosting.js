import React, { Component } from 'react';

import Head from '../genericHead';
import './hosting.css';

class Hosting extends Component {
    render() {
        return (
            <React.Fragment>
                <Head title={'Website Hosting'}></Head>
                <div className='sale-banner'>
                    <p>Sign up today and get a free month</p>
                </div>
                <div className='plans-grid'>
                    <div className='plan'>
                        <h3>Starter</h3>
                        <p>2 Sub Domains</p>
                        <p>50 GB Transfer</p>
                        <p>5 GB Storage</p>
                        <p>Free SSL</p>
                        <h4>$4</h4>
                        <a href='/get-hosting'><button className='purchase-btn'>Purchase</button></a> 
                    </div>
                    <div className='plan'>
                        <h3>Business</h3>
                        <p>Unlimited Sub Domains</p>
                        <p>100 GB Transfer</p>
                        <p>10 GB Storage</p>
                        <p>Free SSL</p>
                        <h4>$8</h4>
                        <a href='/get-hosting'><button className='purchase-btn'>Purchase</button></a>
                    </div>
                    <div className='plan'>
                        <h3>Hyper</h3>
                        <p>Unlimited Sub Domains</p>
                        <p>Unlimited Transfer</p>
                        <p>20 GB Storage</p>
                        <p>Free SSL</p>
                        <h4>$15</h4>
                        <a href='/get-hosting'><button className='purchase-btn'>Purchase</button></a>
                    </div>
                    
                </div>


                <div className='host-with-us'>
                <h2 className='center'>Features</h2>
                    <div className='features-grid'>
                        <div>
                            <img className='' src='/images/icons/ssl.png' alt='' />
                            <h4>Free SSL</h4>
                            <p>No need to pay for SSL</p>
                        </div>
                        <div>
                            <img className='' src='/images/icons/support.png' alt='' />
                            <h4>Best Support</h4>
                            <p>Talk to a real person, not a robot</p>
                        </div>
                        <div>
                            <img className='' src='/images/icons/cloud-server.png' alt='' />
                            <h4>Fast Servers</h4>
                            <p>Don't lose customers over a slow connection</p>
                        </div>
                        <div>
                            <img className='' src='/images/icons/redundancy.png' alt='' />
                            <h4>Redundancy</h4>
                            <p>Handle more connections, no more struggling</p>
                        </div>
                    </div>
                </div>
                <div className='text-container'>
                    <h2>Why Host With Web Dream?</h2>
                    <h3>We are here for you</h3>
                    <p>With our one on one support, you can always be sure there is someone to help you if something goes wrong. Other hosting providers
                        can not match our level of support.
                    </p>
                    <h3>Best price for performance</h3>
                    <p>
                        Our servers are incredibly fast. Every bit of storage space uses SSD's to maximize data transfer. All of our hosting plans are also
                        VPS servers so you don't have to share resources with others.
                    </p>
                </div>

            </React.Fragment>
        )
    }
}

export default Hosting