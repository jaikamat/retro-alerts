import React from 'react';
import { Item, Header, Segment } from 'semantic-ui-react';

export default function UserWishlist({ wantlist }) {
    if (wantlist.length === 0) {
        return <Header as="h4">This user has no items in their wishlist</Header>
    }
    return <React.Fragment>
        <Header as="h4">Customer wishlist</Header>
        <Segment>
            <Item.Group divided>
                {wantlist.map(w => {
                    return <Item key={w._id}>
                        <Item.Content>
                            <Item.Header>SKU: {w.itemId}</Item.Header>
                            <Item.Meta>{w.title}</Item.Meta>
                        </Item.Content>
                    </Item>
                })}
            </Item.Group>
        </Segment>
    </React.Fragment>
}