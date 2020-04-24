import React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.nav`
    /** Fixes the bar to the top */
    position: fixed;
    top: 0;

    /** Take up whole width */
    overflow: hidden;
    width: 100%;

    /** Height */
    height: ${props => props.height}px;

    /** Color */
    background: linear-gradient(salmon, #e66262);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.25);

    /** Font */
    font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;

    /** Display */
    display: flex;
    justify-content: flex-end; // All content flush right except logo
    align-items: center;
`;

const StyledLink = styled(Link)`
    padding: 0 20px 0 20px;
    color: white;
    height: inherit;
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transition: 0.1s linear;
    }
    @media (max-width: 768px) {
        padding: 0 10px 0 10px;
    }
`;

const Logo = styled(StyledLink)`
    margin-right: auto;
`;

const LinkText = styled.div`
    height: inherit;
    display: flex;
    align-items: center;
`;

const navHeight = 50;

export default function Navbar() {
    return (
        <Header height={navHeight}>
            <Router>
                <Logo to="/" replace><LinkText>SnapAlert</LinkText></Logo>
                <StyledLink to="/users" replace><LinkText>Users</LinkText></StyledLink>
                <StyledLink to="/login" replace><LinkText>Log in</LinkText></StyledLink>
            </Router>
        </Header>
    )
}