import { observer } from "mobx-react-lite";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, DropdownItem, DropdownMenu, Image, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../stores/store";

function Navbar(){
    const {userStore: {user, logout}} = useStore();

    return(
        <Menu inverted fixed="top">
            <Container>
                <MenuItem as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </MenuItem>
                <MenuItem as={NavLink} to='/activities' name="Activities"/>
                <MenuItem as={NavLink} to='/errors' name="Errors"/>
                <MenuItem>
                    <Button as={NavLink} to='/createactivity' positive content="Create Activity" />
                </MenuItem>
                <MenuItem position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <DropdownMenu>
                            <DropdownItem as={Link} to={`/profiles/${user?.username}`} text="My Profile" icon='user'/>
                            <DropdownItem onClick={logout} text='Logout' icon='power' />
                        </DropdownMenu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
}

export default observer(Navbar);