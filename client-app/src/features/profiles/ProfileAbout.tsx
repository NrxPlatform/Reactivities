import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Grid, GridColumn, Header, TabPane } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

 function ProfileAbout() {
  const {profileStore} = useStore();
  const {isCurrentUser, profile} = profileStore;
  const [editMode, setEditMode] = useState(false);

  return (
    <TabPane>
        <Grid>
            <GridColumn width={16}>
                <Header floated='left' icon='user' content={`About ${profile?.displayName}`} />
                {isCurrentUser && (
                    <Button floated='right' basic content={editMode ? 'Cancel': 'Edit Profile'} onClick={() => setEditMode(!editMode)}/>
                )}
            </GridColumn>
            <GridColumn width={16}>
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> 
                        : <span style={{whiteSpace:'pre-wrap'}}>{profile?.bio}</span>}
            </GridColumn>
        </Grid>
    </TabPane>
  )
}

export default observer(ProfileAbout);
