import React, { useState, useEffect, useContext } from 'react';
import { Accordion, Segment, Search, Container, Icon, Grid, Label } from 'semantic-ui-react';
import _ from 'lodash';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';
import UserInfo from './UserInfo';
import UserWishlist from './UserWishlist';
import { UserContext } from './UserProvider';

export default function Users() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { userlist, fetchUsers, filterByUsername } = useContext(UserContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Activates the accordion
    const activate = (idx) => {
        if (idx === activeIndex) {
            return setActiveIndex(null);
        }
        return setActiveIndex(idx);
    }

    // Filters users by name
    const filterNames = (e, { value }) => {
        console.log(value);

        setTimeout(async () => {
            if (value.length < 3) {
                await fetchUsers();
                return;
            }
            await filterByUsername(value);
        }, 300)
    }

    const handleSearchChange = _.debounce(filterNames, 500, { leading: false });

    return <React.Fragment>
        <Search placeholder="Search by name" showNoResults={false} onSearchChange={handleSearchChange} />
        <AddUser />
        <Accordion fluid styled>
            {userlist.map((u, idx) => {
                const numMatches = u.wantlist.reduce((acc, curr) => acc + curr.match.length, 0);
                const numNotPending = u.wantlist.reduce((acc, curr) => acc + (curr.pending ? 0 : 1), 0);

                return <React.Fragment key={u._id}>
                    <Accordion.Title active={activeIndex === idx} onClick={() => activate(idx)}>
                        <Icon name="dropdown" />
                        {u.lastname}, {u.firstname} {" "}
                        {!!numMatches && <Label color="teal">{numMatches} in stock</Label>}
                        {!!numNotPending && <Label color="red">{numNotPending} unhandled</Label>}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === idx}>
                        <Container>
                            <Segment>
                                <Grid columns={2} stackable>
                                    <Grid.Column>
                                        <UserInfo {...u} />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <UserWishlist wantlist={u.wantlist} userId={u._id} />
                                    </Grid.Column>
                                </Grid>
                                <DeleteUser userId={u._id} />
                            </Segment>
                        </Container>
                    </Accordion.Content>
                </React.Fragment>
            })}
        </Accordion>
    </React.Fragment>
}