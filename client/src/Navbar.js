import React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';

export default function Navbar() {
    return (
        <Router>
            <Link to="/" replace >ROOT!</Link>
            <Link to="/link" replace >LINK!</Link>
        </Router>
    )
}