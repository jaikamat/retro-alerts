import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SpinnerContext } from './viewComponents/SpinnerContext';
import { Table, Accordion, Segment, Button, Search, Grid, Container, Icon, Header } from 'semantic-ui-react';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const { toggleSpin } = useContext(SpinnerContext);

    const fetchUsers = async () => {
        try {
            toggleSpin.on();
            const { data } = await axios.get(`http://localhost:3000/users`);
            setUsers(data);
            toggleSpin.off();
        } catch (e) {
            toggleSpin.off();
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

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
            const { data } = await axios.post(`http://localhost:3000/users`, { firstname, lastname, email, phone });
            toggleSpin.off();

            await fetchUsers();
        } catch (err) {
            console.log(err);
        }
    }

    // return <React.Fragment>
    //     <Search />
    //     <AddUser addUser={addUser} />
    //     <Table selectable>
    //         <Table.Header>
    //             <Table.Row>
    //                 <Table.HeaderCell width="4">Last Name</Table.HeaderCell>
    //                 <Table.HeaderCell width="4">First Name</Table.HeaderCell>
    //                 <Table.HeaderCell width="4">Email</Table.HeaderCell>
    //                 <Table.HeaderCell width="4">Phone</Table.HeaderCell>
    //             </Table.Row>
    //         </Table.Header>

    //         <Accordion as={Table.Body} fluid>
    //             {users.map((u, idx) => {
    //                 return <React.Fragment key={u._id}>
    //                     <Accordion.Title
    //                         as={Table.Row}
    //                         key={u._id}
    //                         active={activeIndex === idx}
    //                         onClick={() => activate(idx)}
    //                     >
    //                         <Table.Cell>{u.lastname}</Table.Cell>
    //                         <Table.Cell>{u.firstname}</Table.Cell>
    //                         <Table.Cell>{u.email}</Table.Cell>
    //                         <Table.Cell>{u.phone}</Table.Cell>
    //                     </Accordion.Title>

    //                     <Accordion.Content as={Table.Row} active={activeIndex === idx}>
    //                         <Table.Cell width="16">
    //                             <Segment>Cells interlinked within cells interlinked within cells interlinked</Segment>
    //                         </Table.Cell>
    //                     </Accordion.Content>
    //                 </React.Fragment>
    //             })}
    //         </Accordion>
    //     </Table>
    // </React.Fragment>

    return <React.Fragment>
        <Search />
        <AddUser addUser={addUser} />
        <Accordion fluid styled>
            {users.map((u, idx) => {
                return <React.Fragment>
                    <Accordion.Title active={activeIndex === idx} onClick={() => activate(idx)}>
                        <Icon name="dropdown" />
                        {u.lastname}, {u.firstname}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === idx}>
                        <Container>
                            <Segment>
                                <DeleteUser />
                            </Segment>
                        </Container>
                    </Accordion.Content>
                </React.Fragment>
            })}
        </Accordion>
    </React.Fragment>
}