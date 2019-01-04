import React, { Component } from 'react';

import './forms.css';
import Head from './genericHead';
import { NavLink } from 'react-router-dom';

class SignUp extends Component {

    render() {
        return (
            <React.Fragment>
            <Head title={'Create Account'}></Head>
            <div className='large-form'>
                <div className='center-grid-item'>
                    <div className='lg-field'>
                        <input type='email' placeholder='Email Address' />
                    </div>
                    <div className='lg-field'>
                        <input type='password' placeholder='Password' />
                    </div>
                    <button className='block-btn bottom-margin'>Create Account</button>
                </div>
                <NavLink className='form-functions' to='/login'>I have an account</NavLink>
            </div>
            </React.Fragment>
        )
    }
}

export default SignUp