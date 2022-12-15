import React from "react";
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../stores/store";


export default function Navbar(){

    const {activityStore} = useStore();

    return(
        <Menu inverted fixed="top">
            <Container>
                <MenuItem header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </MenuItem>
                <MenuItem name="activities"/>
                <MenuItem>
                    <Button onClick={(e) => activityStore.openForm()} positive content="Create Activity" />
                </MenuItem>
            </Container>
        </Menu>
    )
}