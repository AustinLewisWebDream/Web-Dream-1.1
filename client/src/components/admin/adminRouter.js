import React, { Component } from 'react';
import {Route, BrowserRouter, Switch, withRouter} from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const AdminNavigation = withRouter(props => <AdminNav {...props} />)

class AdminNav extends Component {
    render() {
    const currentTab = this.props.location.pathname;
        return(
            <React.Fragment>
                <ul className='admin-nav-list'>
                    <li>Customers</li>
                    <li>Un-accepted Quotes</li>
                </ul>
            {/* <Route path={'/account/quotes'} component={ QuotesPage } />
            <Route exact path={'/account'} component={ SettingsPage } /> */}
            </React.Fragment>
        )
    }
}

export default (AdminNavigation)