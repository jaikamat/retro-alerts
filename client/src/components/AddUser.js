import React, { useState, useContext } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import { StyledButton, COLOR_3 } from './style';
import { UserContext } from './UserProvider';

export default function AddUser() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [activeModal, setActiveModal] = useState(false);
    const { addUser } = useContext(UserContext);

    const handleAdd = async () => {
        try {
            await addUser({ firstname, lastname, email, phone });
            handleReset();
        } catch (err) {
            console.log(err);
        }
    }

    const handleReset = () => {
        setActiveModal(false);
        setFirstname('');
        setLastname('');
        setEmail('');
        setPhone('');
    }

    const formValid = firstname && lastname && email && phone;

    return <Modal trigger={<StyledButton col={COLOR_3} floated="right" primary onClick={() => setActiveModal(true)}>Add customer</StyledButton>} open={activeModal}>
        <Modal.Header>Add a customer</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <label>First name</label>
                    <input placeholder="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Last name</label>
                    <input placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Email address</label>
                    <input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Phone number</label>
                    <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Field>
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={handleReset}>Cancel</Button>
            <Button disabled={!formValid} onClick={() => handleAdd()}>Submit</Button>
        </Modal.Actions>
    </Modal >
}