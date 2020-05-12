import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { UserContext } from './UserProvider';

export default function EditUser({ userId, contacted }) {
    const { editUser } = useContext(UserContext);

    if (contacted) {
        return <Button onClick={async () => await editUser(userId, { contacted: false })}>Cancel contact</Button>
    }
    return <Button onClick={async () => await editUser(userId, { contacted: true })}>Customer contacted</Button>
}