import React from 'react';
import { Header } from 'semantic-ui-react';

export default function UserInfo({ firstname, lastname, email, phone }) {
    return <React.Fragment>
        <Header as="h2">{firstname} {lastname}</Header>
        <Header as="h4">Email: {email}</Header>
        <Header as="h4">Phone: {phone}</Header>
    </React.Fragment>
}