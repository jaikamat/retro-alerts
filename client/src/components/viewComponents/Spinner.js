import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { SpinnerContext } from './SpinnerContext';
import { COLOR_3 } from '../style';

const rotate = keyframes`
    from {
        transform: rotate(0deg)
    }
    to {
        transform: rotate(360deg)
    }
`;

const SpinStyle = styled.div`
    color: green;
    position: fixed;
    bottom: 10px;
    right: 10px;

    /* Fade In */
    /* TODO: Do fade in here */
    
    /* Animation */
    display: ${({ active }) => active ? `inline-block` : `none`};
    width: 30px;
    height: 30px;
    border: 3px solid #ddd;
    border-radius: 50%;
    border-top-color: ${COLOR_3};
    animation: ${rotate} 1s ease-in-out infinite;
`;

export default function Spinner() {
    const { status } = useContext(SpinnerContext);

    return <SpinStyle active={status}></SpinStyle>
}