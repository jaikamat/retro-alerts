import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default function DeleteUser({ deleteUser, userId }) {
    return <Modal trigger={<Button>Delete user</Button>}>
        <Modal.Header>Delete user</Modal.Header>
        <Modal.Content>
            Do you want to permanently delete this user?
        </Modal.Content>
        <Modal.Actions>
            <Button>Cancel</Button>
            <Button onClick={() => deleteUser(userId)}>Yeppers</Button>
        </Modal.Actions>
    </Modal>
}