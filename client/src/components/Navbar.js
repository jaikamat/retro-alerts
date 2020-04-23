import React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

const navbarHeight = 40;

const Header = styled.div`
    /** Fixes the bar to the top */
    position: fixed;
    top: 0;
    left: 0,

    /** Take up whole width */
    display: block;
    overflow: hidden;
    width: 100%;

    /** Height */
    height: ${navbarHeight}px;

    /** Color */
    background-color: salmon;
`;

export default function Navbar() {
    return (
        <Header>
            <div>
                <Router>
                    <Link to="/" replace >ROOT!</Link>
                    <Link to="/link" replace >LINK!</Link>
                </Router>
            </div>
        </Header>
    )
}