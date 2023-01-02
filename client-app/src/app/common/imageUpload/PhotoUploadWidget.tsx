import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Grid, GridColumn, Header } from 'semantic-ui-react'
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone'

interface Props {
    loading : boolean;
    uploadPhoto : (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto} : Props) {

  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop (){
    if (cropper){
        cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
        files.forEach((element: any) => URL.revokeObjectURL(element.preview));
    }
  }, [files])

  return (
    <Grid>
        <GridColumn width={4}>
            <Header sub color='teal' content='step 1 - Add Photo' />
            <PhotoWidgetDropzone setFiles={setFiles} />
        </GridColumn>
        <GridColumn width={1} />
        <GridColumn width={4}>
            <Header sub color='teal' content='step 2 - Resize Image' />
            {files && files.length > 0 && (
                <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
            )}
        </GridColumn>
        <GridColumn width={1} />
        <GridColumn width={4}>
            <Header sub color='teal' content='step 3 - Preview & Upload' />
            {files && files.length > 0 && (
                 <>
                 <div className='img-preview' style={{minHeight:200, overflow:'hidden'}}></div>
                 <ButtonGroup widths={2}>
                     <Button loading={loading} onClick={onCrop} positive icon='check' />
                     <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                 </ButtonGroup>
                 </>
            )}
        </GridColumn>
    </Grid>
  )
}
