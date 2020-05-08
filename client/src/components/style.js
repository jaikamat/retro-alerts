import styled from 'styled-components';
import { Header, Button } from 'semantic-ui-react';

export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.flush === 'right' ? 'flex-end' : 'space-between'};
    padding: 0 10px 15px 10px;
    align-items: ${props => props.center ? 'center !important' : null};
    flex: 1 !important;
`;

export const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px 5px 5px 5px;
    justify-content: ${props => props.justify === 'start' ? `flex-start` : null};
    flex: 1 !important;
`;

export const ColorfulHeader = styled(Header)`
    color: salmon !important;
`;

export const StyledButton = styled(Button)`
    background-color: ${props => props.primary ? `salmon` : null} !important;
    &:hover {
        background-color: rgba(251, 166, 157, 1) !important;
        transition: 0.1s ease-in !important;
    }
`;