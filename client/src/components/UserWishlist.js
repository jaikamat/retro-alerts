import React, { useState, useContext } from 'react';
import { Segment, Button, Modal, Form, Label } from 'semantic-ui-react';
import { UserContext } from './UserProvider';
import { FlexRow, FlexColumn, ColorfulHeader, StyledButton } from './style';
import styled from 'styled-components';

const WishlistRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center !important;
    border: 1px solid #d9d9d9;
    padding: 10px 10px 10px 10px;
`;

const WishlistItem = styled.div`
    display: flex;    
    flex: 1;
`;

const Spacer = styled.div`
    margin-${props => props.flush === 'left' ? 'left' : 'right'}: auto;
`;

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

    const addItemModal = <Modal trigger={<StyledButton primary onClick={() => setActiveModal(true)}>Add item</StyledButton>} open={activeModal}>
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

    const userWishlist = <FlexColumn>
        {wantlist.map(w => {
            const matches = w.match ? w.match.length : 0;
            const pendingStatus = w.pending ? w.pending : false; // Shows/hides the Pending status buttons

            return <WishlistRow key={w._id}>
                <WishlistItem>
                    <div style={{ marginLeft: '4px', marginTop: '6px' }}>
                        {!!matches && <Label color="teal" ribbon>In stock</Label>}
                    </div>
                    <div>
                        <div><b>UPC: </b>{w.itemId}</div>
                        <div><em>{w.title}</em></div>
                    </div>
                    <Spacer flush="left" />
                    <div>
                        {!pendingStatus && <Button circular icon="check" onClick={() => togglePending(userId, true, w._id)} />}
                        {pendingStatus && <Button color="green" circular icon="check" onClick={() => togglePending(userId, false, w._id)} />}
                    </div>
                    <Button
                        color="red"
                        circular
                        icon="times"
                        onClick={() => removeFromWishlist(userId, w._id)}
                    ></Button>
                </WishlistItem>
            </WishlistRow>
        })}
    </FlexColumn>

    return <Segment>
        <FlexRow center>
            <ColorfulHeader as="h2">Wishlist</ColorfulHeader>
            {addItemModal}
        </FlexRow>
        <FlexRow center>
            {wantlist.length === 0 ? noResultsMsg : userWishlist}
        </FlexRow>
    </Segment>
}