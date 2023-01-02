import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { Button, ButtonGroup, Card, CardGroup, Grid, GridColumn, Header, Image, TabPane } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

function ProfilePhoto({profile}: Props) {
  const {profileStore: {isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto}} = useStore();
  const [ addPhotoMode, setAddPhotoMode ] = useState(false);
  const [target, setTarget] = useState('');
  
  function handlePhotoUpload(file:Blob){
        uploadPhoto(file).then(() => setAddPhotoMode(false));
  }

  function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>){
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  function handleDelete(photo: Photo, e: SyntheticEvent<HTMLButtonElement>){
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <TabPane>
        <Grid>
            <GridColumn width={16}>
                <Header floated='left' icon='image' content='Photos' />
                {isCurrentUser && (
                    <Button floated='right' basic content={addPhotoMode ? 'cancel' : 'Add Photo'} 
                        onClick={() => setAddPhotoMode(!addPhotoMode)}/>
                )}
            </GridColumn>
            <GridColumn width={16}>
            {addPhotoMode ? (<PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />) : (
                <CardGroup itemsPerRow={5}>
                    {profile.photos?.map(photo => (
                        <Card key={photo.id}>
                            <Image src={photo.url} />
                            {isCurrentUser && (
                                <ButtonGroup>
                                    <Button 
                                    basic
                                    color='green'
                                    content='Main'
                                    name={'main' + photo.id}
                                    disabled={photo.isMain}
                                    loading={target === 'main' + photo.id && loading}
                                    onClick={e => handleSetMainPhoto(photo, e)}
                                    />
                                    <Button
                                    basic
                                    color='red'
                                    icon='trash'
                                    loading={target === photo.id && loading} 
                                    onClick={e => handleDelete(photo, e)}
                                    disabled={photo.isMain}
                                    name={photo.id}/>
                                </ButtonGroup>
                            )}
                        </Card>
                    ))}
                </CardGroup>
            )}
            </GridColumn>
        </Grid>
    </TabPane>
  )
}

export default observer(ProfilePhoto);