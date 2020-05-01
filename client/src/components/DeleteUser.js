import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default function DeleteUser({ deleteUser, userId }) {
    const [activeModal, setActiveModal] = useState(false);

    const handleDeletion = () => {
        deleteUser(userId);
        setActiveModal(false);
    }

    return <Modal trigger={<Button onClick={() => setActiveModal(true)}>Delete user</Button>} open={activeModal}>
        <Modal.Header>Delete user</Modal.Header>
        <Modal.Content>
            Do you want to permanently delete this user?
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={() => setActiveModal(false)}>Cancel</Button>
            <Button onClick={handleDeletion}>Delete</Button>
        </Modal.Actions>
    </Modal>
}