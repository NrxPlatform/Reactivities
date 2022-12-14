import React from 'react'
import { Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store';
import ProfileAbout from './ProfileAbout';
import ProfileActivity from './ProfileActivity';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhoto from './ProfilePhoto'

interface Props {
    profile: Profile;
}

export default function ProfileContent({profile} : Props) {
  const {profileStore : {setActiveTab}} = useStore();


  const panes = [
    {menuItem: 'About', render: () => <ProfileAbout />},
    {menuItem: 'Photos', render: () => <ProfilePhoto profile={profile} />},
    {menuItem: 'Events', render: () => <ProfileActivity />},
    {menuItem: 'Followers', render: () => <ProfileFollowings />},
    {menuItem: 'Following', render: () => <ProfileFollowings />}
  ]

  return (
    <Tab menu={{fluid: true, vertical:true}} menuPosition='right' panes={panes}
     onTabChange={(e, data) => setActiveTab(data.activeIndex)}/>
  )
}
