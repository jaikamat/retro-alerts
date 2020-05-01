import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

export default function AddUser({ addUser }) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [activeModal, setActiveModal] = useState(false);

    const handleAdd = async () => {
        try {
            await addUser({ firstname, lastname, email, phone });
            setActiveModal(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancel = () => {
        setActiveModal(false);
        setFirstname('');
        setLastname('');
        setEmail('');
        setPhone('');
    }

    const formValid = firstname && lastname && email && phone;

    return <Modal trigger={<Button onClick={() => setActiveModal(true)}>Add customer</Button>} open={activeModal}>
        <Modal.Header>Add a customer</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <label>First name</label>
                    <input placeholder="First name" value={firstname} onChange={({ target }) => setFirstname(target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Last name</label>
                    <input placeholder="Last name" value={lastname} onChange={({ target }) => setLastname(target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Email address</label>
                    <input placeholder="Email address" value={email} onChange={({ target }) => setEmail(target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Phone number</label>
                    <input placeholder="Phone number" value={phone} onChange={({ target }) => setPhone(target.value)} />
                </Form.Field>
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={() => handleCancel(false)}>Cancel</Button>
            <Button disabled={!formValid} onClick={() => handleAdd()}>Submit</Button>
        </Modal.Actions>
    </Modal >
}