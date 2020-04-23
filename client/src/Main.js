import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Homepage from './Homepage';

export default function Main() {
    return (
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/link" component={Homepage} />
        </Switch>
    )
}