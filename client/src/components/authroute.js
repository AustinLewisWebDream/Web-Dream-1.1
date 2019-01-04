import React, { Component } from "react";
import { connect } from 'react-redux';
import { setLoginWindow } from '../actions'
import { Route, Redirect } from "react-router-dom";

class AuthRoute extends Component {
    render() {
        if(this.props.isAuthenticated) {
            return(
                <Route {...this.props} />
            )
        }
        else {
            this.props.setLoginWindow(true);
            return(
                <Redirect to='/' />
            )
        }
    }
}


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { setLoginWindow })(AuthRoute)