import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import Input from './viewComponents/Input';
import Container from './viewComponents/Container';
import Card from './viewComponents/Card';
import Form from './viewComponents/Form';
import Button from './viewComponents/Button';
import { AuthContext } from './AuthContext';
import { SpinnerContext } from './viewComponents/SpinnerContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { toggleSpin } = useContext(SpinnerContext);

    return <AuthContext.Consumer>
        {({ handleLogin, loggedIn }) => {
            const login = async (username, password) => {
                try {
                    toggleSpin.on();
                    const isLoggedIn = await handleLogin(username, password);

                    if (isLoggedIn) {
                        toggleSpin.off()
                    } else {
                        toggleSpin.off()
                        setUsername('');
                        setPassword('');
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
                        <Input placeholder="Username" value={username} onChange={
                            ({ target }) => setUsername(target.value)
                        } />
                        <Input placeholder="Password" value={password} type="password" onChange={
                            ({ target }) => setPassword(target.value)
                        } />
                        <Button disabled={!username || !password} onClick={() => login(username, password)}>Submit</Button>
                    </Form>
                </Card>
            </Container>
        }}
    </AuthContext.Consumer>
}