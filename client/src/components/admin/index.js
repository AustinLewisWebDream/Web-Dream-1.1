import React, { Component } from "react";
import { connect } from 'react-redux';
import { RETRIEVE_USERS, AUTHENTICATE_ADMIN } from './routes';
import { Redirect } from 'react-router-dom';
import axios from "axios";

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
        if(await this.checkIfAdmin()) {
            let response = await axios.post(RETRIEVE_USERS, {}, {'authorization': localStorage.getItem('jwtToken')});
            this.setState({
                users: response.data
            })
        } else {
            this.setState({ unauthorizedAccess: true })
        }
    }
    async checkIfAdmin() {
        const response = await fetch(AUTHENTICATE_ADMIN, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                email: this.props.adminEmail
            })
        })
        let isAdmin = await response.json();
        return isAdmin
    }
}

const mapStateToProps = (state) => {
    return {
        adminEmail: state.auth.user.email,
    }
}

export default connect(mapStateToProps)(AdminIndex)