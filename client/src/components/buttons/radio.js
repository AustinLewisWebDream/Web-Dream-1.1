import React, { Component } from 'react'

import './buttons.css'

class RadioButton extends Component {
    render() {
        return (
            <React.Fragment>
                <label class="control control-radio">
                    {this.props.children}
                    <input onChange={this.props.handleChange} value={this.props.value} type="radio" name="radio"  />
                    <div class="control_indicator"></div>
                </label>
            </React.Fragment>
        )
    }
}

export default RadioButton