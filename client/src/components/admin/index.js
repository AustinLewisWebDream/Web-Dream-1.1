import React, { Component } from "react";
import { connect } from 'react-redux';
import { RETRIEVE_USERS, AUTHENTICATE_ADMIN } from './routes';
import { Redirect } from 'react-router-dom';
import Axios from "axios";

import './admin.css'
import AdminRouter from './adminRouter';
import CustomerList from './customers/customerList';

class AdminIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            unauthorizedAccess: false
        }
    }
    render() {
        if(this.state.unauthorizedAccess) {
            return <Redirect to='/' />
        }
        else {
            return(
                <React.Fragment>
                    <div className='admin-page'>
                        <div className='nav'>
                            <AdminRouter />
                        </div>
                        <div className='content'>
                            <h1>Customers</h1>
                            <CustomerList customers={this.state.users} />
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
    async componentWillMount() {
        if(this.checkIfAdmin()) {
            this.getAllUsersAndSetState();
        } else {
            this.setState({ unauthorizedAccess: true })
        }
    }
    async checkIfAdmin() {
        const isAdmin = await Axios.post(AUTHENTICATE_ADMIN, {email: this.props.adminEmail}, {headers: { 'authorization': localStorage.getItem('jwtToken')}})
        return isAdmin
    }
    async getAllUsersAndSetState() {
        console.log('Getting users')
        try {
            const response = await Axios.post(RETRIEVE_USERS, {email: this.props.adminEmail}, {headers: { 'authorization': localStorage.getItem('jwtToken') }})
            this.setState({ users : response.data })
        } catch (err) {
            console.log(err)
        }
    }

}

const mapStateToProps = (state) => {
    return {
        adminEmail: state.auth.user.email,
    }
}

export default connect(mapStateToProps)(AdminIndex)