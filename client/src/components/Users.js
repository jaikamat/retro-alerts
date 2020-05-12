import React, { useState, useEffect, useContext } from 'react';
import { Accordion, Search, Container, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import styled from 'styled-components';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';
import EditUser from './EditUser'
import UserInfo from './UserInfo';
import UserWishlist from './UserWishlist';
import ContactAlert from './ContactAlert';
import { UserContext } from './UserProvider';
import { FlexRow, FlexColumn, StyledLabel, COLOR_5 } from './style';

const AccordionHeader = styled(Accordion.Title)`
background-color: ${props => props.active ? `#eee` : null} !important;
&:hover {
    background-color: #eee !important;
}
`;

const AccordionContent = styled(Accordion.Content)`
background-color: ${props => props.active ? `#eee` : null} !important;
`;

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
        <FlexRow>
            <Search placeholder="Search by name" showNoResults={false} onSearchChange={handleSearchChange} />
            <AddUser />
        </FlexRow>
        <Accordion fluid styled>
            {userlist.map((u, idx) => {
                const numMatches = u.wantlist.reduce((acc, curr) => acc + curr.match.length, 0);
                const numNotPending = u.wantlist.reduce((acc, curr) => acc + (curr.pending ? 0 : 1), 0);

                return <React.Fragment key={u._id}>
                    <AccordionHeader active={activeIndex === idx} onClick={() => activate(idx)}>
                        <Icon name="dropdown" />
                        {u.lastname}, {u.firstname} {" "}
                        {!!numMatches && <StyledLabel col={COLOR_5}>{numMatches} in stock</StyledLabel>}
                        {!!numNotPending && <StyledLabel col="red">{numNotPending} unhandled</StyledLabel>}
                        <ContactAlert contacted={u.contacted} />
                    </AccordionHeader>
                    <AccordionContent active={activeIndex === idx}>
                        <Container>
                            <FlexRow>
                                <FlexColumn justify="start">
                                    <UserInfo {...u} />
                                </FlexColumn>
                                <FlexColumn>
                                    <UserWishlist wantlist={u.wantlist} userId={u._id} />
                                </FlexColumn>
                            </FlexRow>
                            <FlexRow flush="right">
                                <DeleteUser userId={u._id} />
                                <EditUser userId={u._id} contacted={u.contacted} />
                            </FlexRow>
                        </Container>
                    </AccordionContent>
                </React.Fragment>
            })}
        </Accordion>
    </React.Fragment>
}