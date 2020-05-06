import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SpinnerContext } from './viewComponents/SpinnerContext';
import { Accordion, Segment, Search, Container, Icon, Grid, Label } from 'semantic-ui-react';
import makeAuthHeader from '../utils/makeAuthHeader';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';
import UserInfo from './UserInfo';
import UserWishlist from './UserWishlist';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const { toggleSpin } = useContext(SpinnerContext);

    const fetchUsers = async () => {
        try {
            toggleSpin.on();
            const { data } = await axios.get(`http://localhost:3000/users`, { headers: makeAuthHeader() });
            setUsers(data);
            toggleSpin.off();
        } catch (e) {
            toggleSpin.off();
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // Replaces a user and triggers a re-render
    const setSingleUser = (user) => {
        const usersCopy = [...users];
        const idx = usersCopy.findIndex(el => el._id === user._id);
        usersCopy.splice(idx, 1, user); // Mutate the array in-place with the new user
        setUsers(usersCopy);
    }

    // Activates the accordion
    const activate = (idx) => {
        if (idx === activeIndex) {
            return setActiveIndex(null);
        }
        return setActiveIndex(idx);
    }

    // Adds a user
    const addUser = async ({ firstname, lastname, email, phone }) => {
        try {
            toggleSpin.on();
            await axios.post(`http://localhost:3000/users`, { firstname, lastname, email, phone }, { headers: makeAuthHeader() });
            toggleSpin.off();

            await fetchUsers();
        } catch (err) {
            console.log(err);
        }
    }

    // Deletes a user
    const deleteUser = async userId => {
        try {
            toggleSpin.on();
            await axios.delete(`http://localhost:3000/users/${userId}`, { headers: makeAuthHeader() })
            toggleSpin.off();

            await fetchUsers();
        } catch (err) {
            console.log(err);
        }
    }

    // Updates Row labels
    const updateRowLabel = () => {
        console.log('updating row label');
    }

    return <React.Fragment>
        <Search />
        <AddUser addUser={addUser} />
        <Accordion fluid styled>
            {users.map((u, idx) => {
                const numMatches = u.wantlist.reduce((acc, curr) => acc + curr.match.length, 0);
                const numNotPending = u.wantlist.reduce((acc, curr) => acc + (curr.pending ? 0 : 1), 0);

                return <React.Fragment key={u._id}>
                    <Accordion.Title active={activeIndex === idx} onClick={() => activate(idx)}>
                        <Icon name="dropdown" />
                        {u.lastname}, {u.firstname} {" "}
                        {!!numMatches && <Label color="teal">{numMatches} in stock</Label>}
                        {!!numNotPending && <Label color="red">{numNotPending} unhandled</Label>}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === idx}>
                        <Container>
                            <Segment>
                                <Grid columns={2} stackable>
                                    <Grid.Column>
                                        <UserInfo {...u} />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <UserWishlist wantlist={u.wantlist} userId={u._id} setSingleUser={setSingleUser} />
                                    </Grid.Column>
                                </Grid>
                                <DeleteUser deleteUser={deleteUser} userId={u._id} />
                            </Segment>
                        </Container>
                    </Accordion.Content>
                </React.Fragment>
            })}
        </Accordion>
    </React.Fragment>
}