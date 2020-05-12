import React from 'react';
import { Icon } from 'semantic-ui-react';
import { StyledLabel, COLOR_4 } from './style';
import subtractDate from '../utils/subtractDate';

export default function ContactAlert({ contacted }) {
    if (!contacted) return null;

    const numDays = subtractDate(contacted);
    // If 0 is the difference, we know the customer was contacted today
    const message = numDays > 0 ? `Contacted ${numDays} ago` : `Contacted today`;

    return <StyledLabel col={COLOR_4}>
        <Icon name="phone" />
        {message}
    </StyledLabel>
}