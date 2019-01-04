import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class InfoGrid extends Component {
    render() {
        return ( 
            <div>
                <div className='info-grid'>
                    <div className='center-stuff'>
                        <h1>Development</h1>
                        <p>Handle more traffic with a custom Node.js back-end built for speed and users.</p>
                        <NavLink className='no-link' to='/quote'><button className='sub-btn'>Build Now</button></NavLink>
                        
                    </div>
                    <div className='center-div'>
                        <img className='graph' src='/images/graph.png' />
                    </div>
                </div>
                <div className='info-grid alt-background'>
                    <div className='center-div'>
                        <img className='smaller-img' src='/images/server.png' />
                    </div>
                    <div className='center-stuff'>
                        <h1>Hosting</h1>
                        <p>Get awesome speed at an awesome price when you host at Web Dream.</p>
                        <NavLink className='no-link' to='/get-hosting'><button className='sub-btn'>Get Hosting</button></NavLink>
                    </div>
                </div>

            </div>
        )
    }
}

export default InfoGrid