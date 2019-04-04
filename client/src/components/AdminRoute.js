import React, { Component } from "react";
import { connect } from 'react-redux';
import { setLoginWindow } from '../actions'
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import { AUTHENTICATE_ADMIN } from "./admin/routes";

class AdminRoute extends Component {
    constructor() {
        super();
        this.state = {
            isAdmin : this.componentWillMount
        }
    }
    render() {
        if(this.state.isAdmin == true) {
            console.log(this.props)
            return(
                <Route {...this.props} />
            )
        }
        else {
            return(
                <h1 className='center'>403</h1>
            )
        }
    }
    async componentWillMount() {
        console.log('Athenticating admin')
        let admin = await axios.post(AUTHENTICATE_ADMIN, {}, {'authorization': localStorage.getItem('jwtToken')});
        console.log(admin.data.data)
        await this.setState({
            isAdmin : admin.data.data
        });
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { setLoginWindow })(AdminRoute)