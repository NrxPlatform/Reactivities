
import { observer } from 'mobx-react-lite'
import React from 'react'
import { CardGroup, Grid, GridColumn, Header, TabPane } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store'
import ProfileCard from './ProfileCard';

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;
  
    return (
        <TabPane loading={loadingFollowings}>
            <Grid>
                <GridColumn width={16}>
                    <Header floated='left' icon='user' 
                        content={activeTab === 3 ? `People following ${profile?.displayName}` : `${profile?.displayName} is following`} />
                </GridColumn>
                <GridColumn width={16}>
                    <CardGroup itemsPerRow={4}>
                        {followings.map((profile, index) => (
                            <ProfileCard key={index} profile={profile} />
                        ))}
                    </CardGroup>
                </GridColumn>
            </Grid>
        </TabPane>
  )
})
