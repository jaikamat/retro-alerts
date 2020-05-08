import React from 'react';
import { Segment } from 'semantic-ui-react';
import { ColorfulHeader } from './style';

export default function UserInfo({ firstname, lastname, email, phone }) {
    return <Segment>
        <ColorfulHeader as="h2">Customer Info</ColorfulHeader>
        <div>
            <p><b>Name:</b> {firstname} {lastname}</p>
            <p><b>Email:</b> {email}</p>
            <p><b>Phone:</b> {phone}</p>
        </div>
    </Segment>
}