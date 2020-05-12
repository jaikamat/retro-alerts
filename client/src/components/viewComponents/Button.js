import styled from 'styled-components';
import { COLOR_3 } from '../style';

const Button = styled.button`
    color: white;
    background-color: ${COLOR_3};
    border: 0px;
    border-radius: 5px;
    padding: 12px 20px 12px 20px;
    text-align: center;
    outline: none;
    &:hover {
        background-color: rgba(251, 166, 157, 1);
        transition: 0.1s ease-in;
        cursor: pointer;
    }
    &:disabled {
        background-color: #d0d0d0;
        cursor: auto;
    }
`;

export default Button