import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Login from './Login';
import Homepage from './Homepage';

const PadContent = styled.div`
    margin-top: ${props => props.marginTop}px;
`;

export default function Main() {
    return (
        <PadContent marginTop={50}>
            <Switch>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/login" component={Login} />
            </Switch>
        </PadContent>
    )
}