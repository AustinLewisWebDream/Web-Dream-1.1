import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './navbar.css';

class Dropdown extends Component {
    render() {
        const links = this.props.links
        const list = links.map((item) => {
            return(
                <NavLink className='dropdown-link' key={item.id} to={item.link}>{item.title}</NavLink>
            )

        });
        return (
            <React.Fragment>
                <div class="dropdown">
                <NavLink class="link" to='#'>{this.props.title}</NavLink>
                    <div class="dropdown-content">
                        {list}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Dropdown