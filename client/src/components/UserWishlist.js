import React, { useState, useContext } from 'react';
import { Item, Segment, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from './UserProvider';
import { FlexRow, FlexColumn } from './style';

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

    const addItemModal = <Modal trigger={<Button primary onClick={() => setActiveModal(true)}>Add item</Button>} open={activeModal}>
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

    const noResultsMsg = <p>This customer's wishlist is empty!</p>;

    const userWishlist = <Item.Group divided>
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
                <Item.Extra>
                    {!pendingStatus && <Button floated="right" onClick={() => togglePending(userId, true, w._id)}>Set pending</Button>}
                    {pendingStatus && <Button floated="right" onClick={() => togglePending(userId, false, w._id)}>Cancel pending</Button>}
                </Item.Extra>
                <Item.Extra><Button primary floated="right" onClick={() => removeFromWishlist(userId, w._id)}>Remove</Button></Item.Extra>

            </Item>
        })}
    </Item.Group>

    return <FlexColumn>
        <Segment>
            <FlexRow center>
                <h2>Customer wishlist</h2>
                {addItemModal}
            </FlexRow>
            <FlexRow>
                {wantlist.length === 0 ? noResultsMsg : userWishlist}
            </FlexRow>
        </Segment>
    </FlexColumn>
}