import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Item, Header, Segment, Button, Modal, Form } from 'semantic-ui-react';
import { SpinnerContext } from './viewComponents/SpinnerContext';

export default function UserWishlist({ wantlist, userId, setSingleUser }) {
    const { toggleSpin } = useContext(SpinnerContext);
    const [itemId, setItemId] = useState('');
    const [title, setTitle] = useState('');
    const [activeModal, setActiveModal] = useState(false);

    // Add an item to user's wishlist
    const addToWishlist = async () => {
        try {
            toggleSpin.on();
            const { data } = await axios.post(`http://localhost:3000/users/${userId}/wantlist`, { title, itemId });
            setActiveModal(false);
            setSingleUser(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Sets the 'pending' status of individual customer wishlist items
     * @param {boolean} status
     * @param {string} wantlistItemId
     */
    const togglePending = async (status, wantlistItemId) => {
        try {
            toggleSpin.on();
            const { data } = await axios.post(`http://localhost:3000/users/${userId}/wantlist/${wantlistItemId}`, {
                setPending: status
            });
            setSingleUser(data);
            toggleSpin.off();
        } catch (err) {
            console.log(err);
        }
    }

    // Delete item from user's wishlist
    const removeFromWishlist = async (wantlistItemId) => {
        try {
            toggleSpin.on();
            const { data } = await axios.delete(`http://localhost:3000/users/${userId}/wantlist/${wantlistItemId}`);
            setSingleUser(data);
            toggleSpin.off();
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
            <Button disabled={!itemId || !title} onClick={addToWishlist}>Submit</Button>
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
                        <Item.Extra><Button primary floated="right" onClick={() => removeFromWishlist(w._id)}>Remove from list</Button></Item.Extra>
                        <Item.Extra>
                            {!pendingStatus && <Button floated="right" onClick={() => togglePending(true, w._id)}>Set as pending</Button>}
                            {pendingStatus && <Button floated="right" onClick={() => togglePending(false, w._id)}>Cancel pending</Button>}
                        </Item.Extra>
                    </Item>
                })}
            </Item.Group>
        </Segment>
    </React.Fragment>
}