import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SpinnerContext } from './viewComponents/SpinnerContext';
import { Table, Accordion, Segment, Container } from 'semantic-ui-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
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

    // Activates the accordion
    const activate = (idx) => {
        if (idx === activeIndex) {
            return setActiveIndex(null);
        }
        return setActiveIndex(idx);
    }

    return <div>
        <Table celled fixed selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width="4">Last Name</Table.HeaderCell>
                    <Table.HeaderCell width="4">First Name</Table.HeaderCell>
                    <Table.HeaderCell width="4">Email</Table.HeaderCell>
                    <Table.HeaderCell width="4">Phone</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Accordion as={Table.Body}>
                {users.map((u, idx) => {
                    return <React.Fragment key={u._id}>
                        <Accordion.Title
                            as={Table.Row}
                            key={u._id}
                            active={activeIndex === idx}
                            onClick={() => activate(idx)}
                        >
                            <Table.Cell>{u.lastname}</Table.Cell>
                            <Table.Cell>{u.firstname}</Table.Cell>
                            <Table.Cell>{u.email}</Table.Cell>
                            <Table.Cell>{u.phone}</Table.Cell>
                        </Accordion.Title>
                        {/* <Accordion.Content as={Table.Row} active={activeIndex === idx}>
                            <Table.Cell width="16">
                                Cells interlinked within cells interlinked within cells interlinked
                            </Table.Cell>
                        </Accordion.Content> */}
                        <Accordion.Content as={Table.Row} active={activeIndex === idx}>
                            <Segment>
                                Cells interlinked within cells interlinked within cells interlinked
                            </Segment>
                        </Accordion.Content>
                    </React.Fragment>
                })}
            </Accordion>
        </Table>
    </div>
}