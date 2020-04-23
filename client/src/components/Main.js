import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Login from './Login';
import Homepage from './Homepage';

const PadContent = styled.div`
    margin-top: 40px;
`;



export default function Main() {
    return (
        <PadContent>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/link" component={Homepage} />
            </Switch>
        </PadContent>
    )
}