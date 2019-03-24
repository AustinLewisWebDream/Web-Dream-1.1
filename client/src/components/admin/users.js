import React, { Component } from "react";

class UserList extends Component {
    render() {
        const userMap = this.props.users.map(user => {
            return(
                <React.Fragment>
                    <li>{user.email}</li>
                </React.Fragment>
            )
        });
        return (
            <React.Fragment>
                <ul>
                    {userMap}
                </ul>
            </React.Fragment>
        )
    }
}



export default UserList