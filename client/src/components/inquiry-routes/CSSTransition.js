import React,{Component} from 'react';

import './inq.css';

class TransitionContent extends Component {
    render() {
        return(
            <React.Fragment>
                <h2 className='sub-title'>{this.props.title}</h2>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export default TransitionContent