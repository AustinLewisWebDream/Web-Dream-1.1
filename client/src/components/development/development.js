import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './development.css'
import Head from '../genericHead';

class Development extends Component {
    render() {
        return (
            <React.Fragment>
                <Head title={'Development'}></Head>
                <div className='sale-banner'>
                        <p>50% off hosting with development services</p>
                        <div className='center-div'>
                            <NavLink className='no-link' to='/quote'><button className='lg-btn'>Get Started</button></NavLink>
                        </div>
                        
                </div>
                <div className='container'>
                    <h2>Benefits</h2>
                    <div className='divider align'>
                        <div className='center center-grid-item'>
                            <img src='/images/icons/money.png' />
                            <h3>Affordable</h3>
                            <p>Get the lowest prices on website developments services</p>
                        </div>
                        <div className='center center-grid-item'>
                            <img src='/images/icons/phone.png' />
                            <h3>Mobile Ready</h3>
                            <p>Our mobile-first design process ensures your site looks great on smartphones</p>
                        </div>
                        <div className='center center-grid-item'>
                            <img src='/images/icons/code-file.png' />
                            <h3 className='center-grid-item'>You own the code</h3>
                            <p>You own the code to your website. Do what you want with it, when you want</p>
                        </div>
                        <div className='center center-grid-item'>
                            <img src='/images/icons/truck.png' />
                            <h3>Transportable</h3>
                            <p>Take your code to any hosting provider. (You get a discount on our hosting thought)</p>
                        </div>
                    </div>
                    <br></br>
                </div>
                <div className='section'>
                    <h2>Tech We Use</h2>
                    <div className='center'>
                        <div className='res-two-grid'>
                            <div className='res-two-grid'>
                                <div>
                                    <h3>React</h3>
                                    <img className='tech-icon' src='/images/icons/react.png' alt='React Logo' />
                                </div>
                                
                                
                                <ul className='company-names'>
                                <h4>Also used by:</h4>
                                    <li>Netflix</li>
                                    <li>Yahoo!</li>
                                    <li>Khan Academy</li>
                                    <li>Atlassian</li>
                                </ul>
                            </div>
                            <div className='res-two-grid'>
                                <div>
                                <h3>MongoDB</h3>
                                <img className='tech-icon' src='/images/icons/mongodb.png' alt='MongoDB Logo' />
                                </div>
                                <ul className='company-names'>
                                <h4>Also used by:</h4>
                                    <li>Adobe</li>
                                    <li>Ebay</li>
                                    <li>Electronic Arts</li>
                                    <li>Cisco</li>
                                </ul>
                            </div>
                            <div className='res-two-grid'>
                                <div>
                                <h3>Node JS</h3>
                                <img className='tech-icon' src='/images/icons/nodejs.png' alt='Nodejs Logo' />
                                </div>


                                <ul className='company-names'>
                                <h4>Also used by:</h4>
                                    <li>Netflix</li>
                                    <li>Linkedin</li>
                                    <li>Walmart</li>
                                    <li>Uber</li>
                                </ul>
                            </div>
                            <div className='res-two-grid'>
                            <div>
                                <h3>Redux</h3>
                                <img className='tech-icon' src='/images/icons/redux.png' alt='Redux Logo' />
                            </div>
                                <ul className='company-names'>
                                <h4>Also used by:</h4>
                                    <li>Instagram</li>
                                    <li>Code School</li>
                                    <li>Clever</li>
                                    <li>Everlane</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>

                <div className='container'>
                <h2>Built For Speed</h2>
                <div className='res-two-grid'>
                    <div>
                    <h3>Node JS</h3>
                    <p>Testing has shown that using Node JS on the server side allows for more concurrent connections. This is why we use
                        it when developing applications. <a target="_blank" rel="noopener noreferrer" href='https://www.hostingadvice.com/blog/comparing-node-js-vs-php-performance/'>Click here</a> to see a speed comparison of node and PHP.
                    </p>
                    <h3>React</h3>
                    <p>
                        Currently, React is the most popular front-end library. With the inclusion of React, your website can be more responsive and feel incredibly fast. 
                    </p>
                    </div>
                    <img src='/images/graph.png' alt='Node JS graph' />
                </div>
                    

                </div>


            </React.Fragment>
        )
    }
}

export default Development