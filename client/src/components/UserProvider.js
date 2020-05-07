import React, { useState, useContext } from 'react';
import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SpinnerContext } from './viewComponents/SpinnerContext';

export const UserContext = React.createContext();

export function UserProvider(props) {
    const [userlist, setUserlist] = useState([]);
    const { toggleSpin } = useContext(SpinnerContext);

    const fetchUsers = async () => {
        try {
            toggleSpin.on();
            const { data } = await axios.get(`http://localhost:3000/users`, { headers: makeAuthHeader() });
            setUserlist(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err)
        }
    }

    const setSingleUser = user => {
        const usersCopy = [...userlist];
        const idx = usersCopy.findIndex(el => el._id === user._id);
        usersCopy.splice(idx, 1, user); // Mutate the array in-place with the new user
        setUserlist(usersCopy);
    }

    const addUser = async ({ firstname, lastname, email, phone }) => {
        try {
            toggleSpin.on();
            await axios.post(`http://localhost:3000/users`, { firstname, lastname, email, phone }, { headers: makeAuthHeader() });
            await fetchUsers();
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const deleteUser = async userId => {
        try {
            toggleSpin.on();
            await axios.delete(`http://localhost:3000/users/${userId}`, { headers: makeAuthHeader() })
            await fetchUsers();
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const filterByUsername = async value => {
        try {
            toggleSpin.on();
            const { data } = await axios.get(`http://localhost:3000/users`, { headers: makeAuthHeader() });
            const filteredUsers = data.filter(({ firstname, lastname }) => {
                const fullname = (firstname + lastname).toLowerCase();
                const termNoSpaces = value.replace(' ', '').toLowerCase();
                return fullname.includes(termNoSpaces);
            })
            setUserlist(filteredUsers);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    return <UserContext.Provider value={{ userlist, fetchUsers, setSingleUser, addUser, deleteUser, filterByUsername }}>
        {props.children}
    </UserContext.Provider>
}
