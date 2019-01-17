import React, {Component} from 'react';
import { connect } from 'react-redux';
import QuotesList from './list';

class QuotesPage extends Component {
    render() {
        return(
            <React.Fragment>
                <div>
                    <QuotesList quotes={this.props.quotes} />
                </div>
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