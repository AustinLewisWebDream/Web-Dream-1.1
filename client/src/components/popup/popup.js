import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../login';
import Register from '../register';
import { setLoginWindow, setRegisterWindow } from '../../actions'



import './popup.css';

class PopUp extends Component {
    
    render() {
        if(this.props.loginPopup) {
            return(
                <div className='bg-modal'>
                    <div className='modal-content'>
                    <p onClick={e => this.props.setLoginWindow(false)} className='close-button'>+</p>
                        <Login />
                    </div>
                </div>
            )
        }
        if(this.props.registerPopup) {
            return(
                <div className='bg-modal'>
                    <div className='modal-content'>
                    <p onClick={e => this.props.setRegisterWindow(false)} className='close-button'>+</p>
                        <Register />
                    </div>
                </div>
            )
        }
        else {
            return (
                null
            )
        }

    }
}


const mapStateToProps = (state) => ({
    loginPopup: state.loginPopup,
    registerPopup: state.registerPopup
})

export  default connect(mapStateToProps, { setLoginWindow, setRegisterWindow })(PopUp)