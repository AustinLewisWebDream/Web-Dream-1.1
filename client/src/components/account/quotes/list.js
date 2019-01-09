import React from 'react'

const QuotesList = props => {
    if(props.quotes) {
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
    else {
        return null
    }
}

export default QuotesList