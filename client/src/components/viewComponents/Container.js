import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    display: flex;
    margin: 70px 0 0 0;
    justify-content: ${props => {
        if (props.left) return `flex-start`;
        if (props.center) return `center`;
        if (props.right) return `flex-end`;
    }}
`;

export default Container;