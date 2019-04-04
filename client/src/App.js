import React, { Component } from 'react';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';

import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser, setLoginWindow } from './actions/authentication';

import AuthRoute from './components/authroute';


import './App.css';

import Home from './components/home/home';
import Hosting from './components/hosting/hosting';
import Design from './components/design/design';

import Navbar from './components/navbar';
import Error from './components/error';
import Footer from './components/footer';
import Development from './components/development/development';
import Account from './components/account/account';
import GetHosting from './components/get-hosting/get-hosting';
import Quote from './components/inquiry-routes/quote';
import LoginPage from './components/loginpage';
import PasswordRecovery from './components/passwordrecover';
import AdminRoute from './components/AdminRoute';
import AdminIndex from './components/admin/index';




if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);

  const persistentUser = jwt_decode(localStorage.user);
  store.dispatch(setCurrentUser(persistentUser));

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={ store } >
      <BrowserRouter>        
        <div>

          <Switch>
            <AdminRoute exact path='/admin' component={AdminIndex} />
            <Navbar></Navbar>
          </Switch>

          <Switch>
            <Route exact path='/' component={ Home } exact />
            <Route path='/hosting' component={ Hosting } />
            <Route path='/development' component={ Development } />
            <Route path='/design' component={ Design } />
            <Route path='/login' component={ LoginPage } />
            <Route path='/quote' component={ Quote } />
            <Route path='/get-hosting' component={ GetHosting } />
            <Route path='/recover' component={ PasswordRecovery } />
            <AuthRoute path='/account' component={ Account } />
            
          </Switch>

          <Switch>
            <AdminRoute exact path='/admin' />
            <Footer />
            <Route component={ Error } />
          </Switch>
          
        </div>
      </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
