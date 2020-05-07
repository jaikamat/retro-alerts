import styled from 'styled-components';

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
    justify-content: ${props => props.justify === 'start' ? `flex-start` : null};
    flex: 1 !important;
`;
