import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import subtractDate from '../utils/subtractDate';

export default function ContactAlert({ contacted }) {
    if (!contacted) return null;

    const numDays = subtractDate(contacted);
    // If 0 is the difference, we know the customer was contacted today
    const message = numDays > 0 ? `Contacted ${numDays} ago` : `Contacted today`;

    return <Label>
        <Icon name="phone" />
        {message}
    </Label>
}