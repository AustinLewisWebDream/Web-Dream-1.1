import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import isEmpty from '../../../validation/is-empty'
;

const QuotesList = props => {
    if(isEmpty(props.quotes)) {
        return (
            <React.Fragment>
                <div>
                    <h2>No Quotes Yet</h2>
                    <button class='sub-btn'><NavLink className='no-link-style' to='/quote'>Get Started</NavLink></button>
                </div>

            </React.Fragment>
        )
    }
    else {
        return (
            props.quotes.map( quote => {
                return (
                    <React.Fragment>
                    <div className='quote-container'>
                        <p>Status: Pending</p>
                        <p>Name: {quote.businessName}</p>
                        <p>Development Type: {quote.developmentType}</p>
                        <p>Goals: {quote.goals}</p>
                        <p>Notes: {quote.notes}</p>
                        <p>Similar Websites: {quote.similarWebsites}</p>
                        <p>Website Type: {quote.WebsiteType}</p>
                    </div>
                </React.Fragment>
                )
            })
        )
    }
}

const mapStateToProps = (state) => {
    return {
        quotes: state.auth.user.quotes
    }
}

export default connect( mapStateToProps )( QuotesList )