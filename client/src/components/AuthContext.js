import React, { useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext();

export const AuthProvider = props => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = async (username, password) => {
        try {
            const { data } = await axios.post(`http://localhost:3000/admin/login`, { username, password });

            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                await setLoggedIn(!!localStorage.getItem('token'));
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            await setLoggedIn(!!localStorage.getItem('token'));
            return loggedIn;
        } catch (err) {
            console.log(err);
        }
    }

    return <AuthContext.Provider value={{ loggedIn, handleLogin, handleLogout }}>
        {props.children}
    </AuthContext.Provider>
}