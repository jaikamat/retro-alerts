import React, { useState, useContext } from 'react';
import { Item, Header, Segment, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from './UserProvider';

export default function UserWishlist({ wantlist, userId }) {
    const { togglePending, addToWishlist, removeFromWishlist } = useContext(UserContext);
    const [itemId, setItemId] = useState('');
    const [title, setTitle] = useState('');
    const [activeModal, setActiveModal] = useState(false);

    const handleAdd = async (userId, title, itemId) => {
        try {
            await addToWishlist(userId, title, itemId);
            handleCancel();
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancel = () => {
        setActiveModal(false);
        setItemId('');
        setTitle('');
    }

    const addItemModal = <Modal trigger={<Button primary onClick={() => setActiveModal(true)}>Add item to wishlist</Button>} open={activeModal}>
        <Modal.Header>Add wishlist item</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <label>UPC</label>
                    <input placeholder="UPC" value={itemId} onChange={({ target }) => setItemId(target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Title/Note</label>
                    <input placeholder="Title or note" value={title} onChange={({ target }) => setTitle(target.value)} />
                </Form.Field>
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button disabled={!itemId || !title} onClick={() => handleAdd(userId, title, itemId)}>Submit</Button>
        </Modal.Actions>
    </Modal>

    if (wantlist.length === 0) {
        return <React.Fragment>
            <Header as="h4">Customer wishlist</Header>
            <p>This customer's wishlist is empty!</p>
            {addItemModal}
        </React.Fragment>
    }

    return <React.Fragment>
        <Header as="h4">Customer wishlist</Header>
        {addItemModal}
        <Segment>
            <Item.Group divided>
                {wantlist.map(w => {
                    const matches = w.match ? w.match.length : 0;
                    const pendingStatus = w.pending ? w.pending : false; // Shows/hides the Pending status buttons

                    return <Item key={w._id}>
                        <Item.Content>
                            <Item.Header>UPC: {w.itemId}</Item.Header>
                            <Item.Meta>{w.title}</Item.Meta>
                            {!!matches && <p style={{ color: 'red' }}>IN STOCK</p>}
                            {pendingStatus && <p style={{ color: 'green' }}>PENDING</p>}

                        </Item.Content>
                        <Item.Extra><Button primary floated="right" onClick={() => removeFromWishlist(userId, w._id)}>Remove from list</Button></Item.Extra>
                        <Item.Extra>
                            {!pendingStatus && <Button floated="right" onClick={() => togglePending(userId, true, w._id)}>Set as pending</Button>}
                            {pendingStatus && <Button floated="right" onClick={() => togglePending(userId, false, w._id)}>Cancel pending</Button>}
                        </Item.Extra>
                    </Item>
                })}
            </Item.Group>
        </Segment>
    </React.Fragment>
}