import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import Input from './viewComponents/Input';
import Container from './viewComponents/Container';
import Card from './viewComponents/Card';
import Form from './viewComponents/Form';
import Button from './viewComponents/Button';
import { AuthContext } from './AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return <AuthContext.Consumer>
        {({ handleLogin, loggedIn }) => {
            const login = async (username, password) => {
                try {
                    const isLoggedIn = await handleLogin(username, password);

                    if (isLoggedIn) {
                        // toast here
                        console.log('logged in!')
                    } else {
                        // also toast here
                        console.log('not logged in!')
                    }
                } catch (err) {
                    console.log(err)
                }
            }

            if (loggedIn) {
                return <Redirect to="/users" />
            }

            return <Container center>
                <Card>
                    <Form>
                        <Input placeholder="Username" onChange={
                            ({ target }) => setUsername(target.value)
                        } />
                        <Input placeholder="Password" type="password" onChange={
                            ({ target }) => setPassword(target.value)
                        } />
                        <Button disabled={!username || !password} onClick={() => login(username, password)}>Submit</Button>
                    </Form>
                </Card>
            </Container>
        }}
    </AuthContext.Consumer>
}