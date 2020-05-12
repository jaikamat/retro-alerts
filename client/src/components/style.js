import styled from 'styled-components';
import { Header, Button, Label } from 'semantic-ui-react';

export const MAIN_COLOR = '#7B1E7A'; // Purple
export const GRAD_COLOR = '#651564'; // Mavbar gradient swatch
export const COLOR_2 = '#B33F62';
export const COLOR_3 = '#F9564F'; // Salmon
export const COLOR_4 = '#FDBE6C'; // Goldenrod
export const COLOR_5 = '#00A6A6'; // Teal
export const HIGHLIGHT = 'fDBE6C69'; // Off-goldenrod

export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${props => {
        if (props.flush === 'left') return 'flex-start';
        if (props.flush === 'right') return 'flex-end';
        return 'space-between';
    }};
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
    color: ${COLOR_2} !important;
`;

export const StyledButton = styled(Button)`
    color: white !important;
    background-color: ${({ col }) => col ? col : null} !important;
    &:hover {
        opacity: 0.5;
        transition: 0.1s ease-in !important;
    }
`;

export const StyledLabel = styled(Label)`
    color: white !important;
    background-color: ${props => props.col} !important;
`;