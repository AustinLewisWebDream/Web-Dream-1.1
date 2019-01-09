import React, {Component} from 'react';
import redux from 'redux';
import { connect } from 'react-redux';
import QuotesList from './list';

class QuotesPage extends Component {
    render() {
        return(
            <React.Fragment>
                <QuotesList quotes={this.props.quotes} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        quotes: state.auth.user.quotes
    }
}

export default connect(mapStateToProps)(QuotesPage)