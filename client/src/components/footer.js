import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div id='footer'>
                <div className='footer-grid'>
                    <img className='logo' src='/images/logo.png' alt='logo' />
                    <div>
                        <ul>
                            <li>Home</li>
                            <li>Hosting</li>
                            <li>Development</li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>Login</li>
                            <li>Sign Up</li>
                            <li></li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>About Us</li>
                            <li>Sitemap</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
                <hr></hr>
                <div className='center-footer'>
                    <div className='icon-grid'>
                        <img src='/images/icons/facebook.png' alt='facebook icon' />
                        <img src='/images/icons/twitter.png' alt='twitter icon' />
                        <img src='/images/icons/instagram.png' alt='instagram icon' />
                        <img src='/images/icons/reddit.png' alt='reddit icon' />
                    </div>
                    <p id='copywrite'>&copy; 2018 Web Dream LLC. All rights reserved</p>
                </div>

            </div>
        )
    }
}

export default Footer