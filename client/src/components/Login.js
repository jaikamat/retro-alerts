import React, { useState } from 'react';
import Input from './viewComponents/Input';
import Container from './viewComponents/Container';
import Card from './viewComponents/Card';
import Form from './viewComponents/Form';
import Button from './viewComponents/Button';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // form for username and password
    // button for submit
    // loader in bottom right
    // toast in top right
    // make request for JWT
    // store JWT, expose it top-level using context API for the navbar
    return <Container center>
        <Card>
            <Form>
                <Input placeholder="Username" onChange={
                    ({ target }) => setUsername(target.value)
                } />
                <Input placeholder="Password" type="password" onChange={
                    ({ target }) => setPassword(target.value)
                } />
                <Button disabled={!username || !password}>Submit</Button>
            </Form>
        </Card>
    </Container>
}