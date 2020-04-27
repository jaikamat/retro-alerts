import styled from 'styled-components';

const Input = styled.input`
    display: block;
    border: 1px solid #eee;
    outline: none;
    padding: 15px 5px 15px 12px;
    border-radius: 5px;
    &::placeholder {
        color: #bfbfbf;
    }
    &:focus {
        border: 1px solid salmon;
        transition: 0.1s linear;
    }
    &:focus::placeholder {
        color: #808080;
    }
`;

export default Input;