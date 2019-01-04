import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Head from './head';
import InfoGrid from './infogrid';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <React.Fragment>
                <Head  />
                <div className='sale-banner-link'>
                    <NavLink to='/hosting'>
                    <div className='sale-banner sale-banner-grid'>
                        <div>
                            <h2>SALE</h2>
                            <p>One month of free hosting on any plan</p>
                        </div>
                        <img className='computer-icon' src='/images/icons/computer-icon.png' alt='Server Switch' />
                    </div>
                    </NavLink>
                </div>
                <InfoGrid/>
                <div className='page-section'>
                    <h1 className='center'>Testimonials</h1>
                    <div className='res-three-grid'>
                        <div className='review'>
                            <img src='/images/icons/review.png' alt='stars' />
                            <p>"We had Web Dream develop a Node backend for us. It is exponetially faster. According to our analytics, our customers are staying on our website twice as long."</p>
                            <p className='name'>-Terrance Wilson</p>
                        </div>
                        <div className='review'>
                            <img src='/images/icons/review.png' alt='stars' />
                            <p>"I don't really understand a lot of the website jargon, but Web Dream helped me every step of the way getting my website up so I can sell my fruits and vegetables. Very excited!"</p>
                            <p className='name'>-Olivia Acres</p>
                        </div>
                        <div className='review'>
                            <img src='/images/icons/review.png' alt='stars' />
                            <p>"I thought getting a website would be the hardest part of starting my business. My friend knew Austin, the owner, and reccommended I talk to him. Super easy. I also got a great discount for being a veteran!"</p>
                            <p className='name'>-Elija Jones</p>
                        </div>
                    </div>
                </div>



            </React.Fragment>
        )
    }
}

export default Home