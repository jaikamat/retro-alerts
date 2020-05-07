import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { FlexRow } from './style';
import { AuthContext } from './AuthContext'

const Logout = () => {
    const { handleLogout, loggedIn } = useContext(AuthContext);

    if (!loggedIn) {
        return <Redirect to="login" />
    }

    return <FlexRow>
        <Button onClick={handleLogout}>Click to log out</Button>
    </FlexRow>
}

export default Logout