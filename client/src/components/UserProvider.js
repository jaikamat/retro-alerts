import React, { useState, useContext } from 'react';
import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SpinnerContext } from './viewComponents/SpinnerContext';

export const UserContext = React.createContext();

export function UserProvider(props) {
    const [userlist, setUserlist] = useState([]);
    const { toggleSpin } = useContext(SpinnerContext);

    const sortUsers = (users) => {
        return [...users].sort((a, b) => {
            const name1 = (a.lastname + a.firstname).toLowerCase();
            const name2 = (b.lastname + b.firstname).toLowerCase();
            if (name1 < name2) return -1;
            if (name1 > name2) return 1;
            return 0;
        });
    }

    const setSingleUser = user => {
        const usersCopy = [...userlist];
        const idx = usersCopy.findIndex(el => el._id === user._id);
        usersCopy.splice(idx, 1, user); // Mutate the array in-place with the new user
        setUserlist(sortUsers(usersCopy));
    }

    const fetchUsers = async () => {
        try {
            toggleSpin.on();
            const { data } = await axios.get(`http://localhost:3000/users`, { headers: makeAuthHeader() });
            setUserlist(sortUsers(data));
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const addUser = async ({ firstname, lastname, email, phone }) => {
        try {
            toggleSpin.on();
            const { data } = await axios.post(`http://localhost:3000/users`, { firstname, lastname, email, phone }, { headers: makeAuthHeader() });
            setUserlist(sortUsers([...userlist, data]));
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const deleteUser = async userId => {
        try {
            toggleSpin.on();
            const { data } = await axios.delete(`http://localhost:3000/users/${userId}`, { headers: makeAuthHeader() })
            const newUserlist = userlist.filter(el => el._id !== data._id);
            setUserlist(sortUsers(newUserlist));
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
            setUserlist(sortUsers(filteredUsers));
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const addToWishlist = async (userId, title, itemId) => {
        try {
            toggleSpin.on();
            const { data } = await axios.post(`http://localhost:3000/users/${userId}/wantlist`, { title, itemId }, { headers: makeAuthHeader() });
            setSingleUser(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Sets the 'pending' status of individual customer wishlist items
     * @param {string} userId
     * @param {boolean} status
     * @param {string} wantlistItemId
     */
    const togglePending = async (userId, status, wantlistItemId) => {
        try {
            toggleSpin.on();
            const { data } = await axios.post(`http://localhost:3000/users/${userId}/wantlist/${wantlistItemId}`, {
                setPending: status
            }, { headers: makeAuthHeader() });
            setSingleUser(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    const removeFromWishlist = async (userId, wantlistItemId) => {
        try {
            toggleSpin.on();
            const { data } = await axios.delete(`http://localhost:3000/users/${userId}/wantlist/${wantlistItemId}`, { headers: makeAuthHeader() });
            setSingleUser(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    return <UserContext.Provider
        value={{
            userlist,
            fetchUsers,
            setSingleUser,
            addUser,
            deleteUser,
            filterByUsername,
            addToWishlist,
            togglePending,
            removeFromWishlist
        }}>
        {props.children}
    </UserContext.Provider>
}
