import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logoutUser } from '../actions/authentication';
import PropTypes from 'prop-types';
import { setLoginWindow, setRegisterWindow } from '../actions'

import './navbar.css';
import Dropdown from './dropdown';
import PopUp from './popup/popup';


class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginPopup : false,
            signupPopup : false,
            links : [
                {
                    id: 0,
                    title: 'Hosting',
                    selected: false,
                    link: '/hosting'
                },
                {
                    id: 1,
                    title: 'Development',
                    selected: false,
                    link: '/development'
                },
            ]
        }
    }
    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <React.Fragment>
                <NavLink className='link' to='/account'>Account</NavLink>
                <a onClick={this.onLogout.bind(this)} className='link'>Logout</a>
            </React.Fragment>

        )
        const guestLinks = (
            <React.Fragment>
                <a onClick={e => this.props.setLoginWindow(true)} className='link'>Login</a>
                <a onClick={e => this.props.setRegisterWindow(true)} className='link'>Sign-Up</a>
            </React.Fragment>
        )
        return (
            <React.Fragment>
                <PopUp />
                <div className="blue-background">
                    <div className='navigation-grid'>
                        <div>
                            <NavLink to='/'><img id='nav-logo' src='/images/logo.png' /></NavLink>
                            <p className='site-id-text'>Dream of a better website</p>
                        </div>
                        
                        <div className='links'>
                            <NavLink className='link' to="/">Home</NavLink>
                            <Dropdown 
                                className='drop-link' 
                                title={'Services'}
                                links={this.state.links} 
                                />
                            {isAuthenticated ? authLinks : guestLinks}
                            
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    
    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }
    onPopupClose(name) {
        this.setState({ [name]: false})
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser, setLoginWindow, setRegisterWindow })(withRouter(Navbar));