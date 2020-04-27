import React, { useState } from 'react';
import axios from 'axios';
import Input from './viewComponents/Input';
import Container from './viewComponents/Container';
import Card from './viewComponents/Card';
import Form from './viewComponents/Form';
import Button from './viewComponents/Button';
import { AuthContext } from './AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // TODO: return a redirect if logged in
    return <AuthContext.Consumer>
        {({ handleLogin, loggedIn }) => {
            return <Container center>
                <Card>
                    <Form>
                        <Input placeholder="Username" onChange={
                            ({ target }) => setUsername(target.value)
                        } />
                        <Input placeholder="Password" type="password" onChange={
                            ({ target }) => setPassword(target.value)
                        } />
                        <Button disabled={!username || !password} onClick={() => handleLogin(username, password)}>Submit</Button>
                    </Form>
                </Card>
            </Container>
        }}
    </AuthContext.Consumer>
}