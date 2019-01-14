import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import isEmpty from '../../../validation/is-empty';

class QuotesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedQuoteID: ''
        }
    }

    render() {
    if(isEmpty(this.props.quotes)) {
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
            this.props.quotes.map( quote => {
                console.log(quote.date);
                var date = quote.date.substring(0, 10)
                
                const showMore = (
                    <React.Fragment>
                            <h2 className='quote-name'>{quote.businessName}</h2>

                            <div className='quote-segment'>
                                <h3>Development Type</h3>
                                <p>{quote.developmentType}</p>
                            </div>
                            <div className='quote-segment'>
                                <h3>Goals</h3>
                                <p>{quote.goals}</p>
                            </div>
                            <div className='quote-segment'>
                                <h3>Similar Websites</h3>
                                <p>{quote.similarWebsites}</p>
                            </div>
                            <div className='quote-segment'>
                                <h3>Remarks</h3>
                                <p>{quote.notes}</p>
                            </div>
                    </React.Fragment>
                )
                return (
                    <React.Fragment>
                    <div key={quote._id} className='quote-container'>
                    <div className='quote-container-grid'>
                        <p>Status: <span className='good'>{quote.status}</span></p>
                        <p>Quote Date: <span className='good'>{date}</span></p>
                        <div></div>
                        <div>
                            <p onClick={e => this.expandQuote(quote._id)} className='standard manage-hosting-link'>Expand<img src='/images/icons/carrot-down.png' alt='Open Manage Menu Button' className='dropdown-carrot' /></p>
                        </div>
                    </div>
                        {this.state.displayedQuoteID == quote._id ? showMore : null}
                    </div>
                </React.Fragment>
                )
            })
        )
    }
    }
    expandQuote(id) {
        this.setState({displayedQuoteID: id})
    }
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        quotes: state.auth.user.quotes
    }
}

export default connect( mapStateToProps )( QuotesList )