import React from 'react';
import { ColorfulHeader } from './style';

export default function UserInfo({ firstname, lastname, email, phone }) {
    return <React.Fragment>
        <ColorfulHeader as="h2">{firstname} {lastname}</ColorfulHeader>
        <div>
            <p><b>Email:</b> {email}</p>
            <p><b>Phone:</b> {phone}</p>
        </div>
    </React.Fragment>
}