import React, { useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext();

export const AuthProvider = props => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = async (username, password) => {
        try {
            const { data } = await axios.post(`http://localhost:3000/admin/login`, {
                username: username,
                password: password
            });

            localStorage.setItem('token', data.access_token);
            setLoggedIn(!!localStorage.getItem('token'));
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setLoggedIn(!!localStorage.getItem('token'));
        } catch (err) {
            console.log(err);
        }
    }

    return <AuthContext.Provider value={{ loggedIn, handleLogin, handleLogout }}>
        {props.children}
    </AuthContext.Provider>
}