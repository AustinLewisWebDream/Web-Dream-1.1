import React, { Component } from 'react';
import {Route, BrowserRouter, Switch, withRouter} from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import HostingPage from './hosting'
import QuotesPage from './quotes'
import SettingsPage from './settings'
import InvoicesPage from './invoices'



const AccountNavigation = withRouter(props => <Nav {...props} />)

class Nav extends Component {
    render() {
    const currentTab = this.props.location.pathname;

    var hostingClass  = 'account-nav-block'
    var quotesClass   = 'account-nav-block'
    var settingsClass = 'account-nav-block'
    var invoicesClass = 'account-nav-block'

    if(currentTab === '/account/hosting') 
        hostingClass += ' active';
    else if(currentTab === '/account')
        settingsClass += ' active';
    else if(currentTab === '/account/quotes')
        quotesClass += ' active';
    else if(currentTab === '/account/invoices')
        invoicesClass += ' active';

        return(
            <React.Fragment>
            <div className='account-navigation'>
                <div className='account-nav-head-container'>
                    <img src='/images/icons/profile-icon.png' alt='Profile Image' className='profile-image'/>
                    <p>Welcome back!</p>
                </div>
                <div className='account-nav-grid'>
                    <div className={settingsClass}>
                        <NavLink className='no-link-style account-link' to='/account'><p>Account</p></NavLink>
                    </div>
                    <div className={hostingClass}>
                        <NavLink className='no-link-style account-link' to='/account/hosting'><p>Hosting</p></NavLink>
                    </div>
                    <div className={quotesClass}>
                        <NavLink className='no-link-style account-link' to='/account/quotes'><p>Quotes</p></NavLink>
                    </div>

                    <div className={invoicesClass}>
                        <NavLink className='no-link-style account-link' to='/account/invoices'><p>Invoices</p></NavLink>
                    </div>
                </div>
            </div>
            <Route path={'/account/quotes'} component={ QuotesPage } />
            <Route path={'/account/hosting'} component={ HostingPage } />
            <Route path={'/account/invoices'} component={ InvoicesPage } />
            <Route exact path={'/account'} component={ SettingsPage } />
            </React.Fragment>
        )
    }
}

export default (AccountNavigation)