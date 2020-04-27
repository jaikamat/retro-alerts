import React from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext'

const Logout = () => {
    return <AuthContext.Consumer>
        {({ handleLogout, loggedIn }) => {
            if (!loggedIn) {
                return <Redirect to="login" />
            }

            return <div>
                <button onClick={handleLogout}>
                    Click to log out
                </button>
            </div>
        }}
    </AuthContext.Consumer>
}

export default Logout