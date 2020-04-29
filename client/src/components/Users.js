import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SpinnerContext } from './viewComponents/SpinnerContext';
import { Table } from 'semantic-ui-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const { toggleSpin } = useContext(SpinnerContext);

    useEffect(() => {
        (async () => {
            try {
                toggleSpin.on();
                const { data } = await axios.get(`http://localhost:3000/users`);
                setUsers(data);
                toggleSpin.off();
            } catch (e) {
                toggleSpin.off();
                console.log(e)
            }
        })();
    }, [])

    return <div>
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                    <Table.HeaderCell>First Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Phone</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {users.map(u => {
                    return <Table.Row>
                        <Table.Cell>{u.lastname}</Table.Cell>
                        <Table.Cell>{u.firstname}</Table.Cell>
                        <Table.Cell>{u.email}</Table.Cell>
                        <Table.Cell>{u.phone}</Table.Cell>
                    </Table.Row>
                })}
            </Table.Body>
        </Table>
    </div>
}