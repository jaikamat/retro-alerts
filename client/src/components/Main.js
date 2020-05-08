import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Login from './Login';
import Logout from './Logout';
import Homepage from './Homepage';
import Users from './Users';

const PadContent = styled.div`
    margin-top: ${props => props.marginTop}px;
`;

export default function Main() {
    return (
        <PadContent marginTop={65}>
            <Switch>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
            </Switch>
        </PadContent>
    )
}