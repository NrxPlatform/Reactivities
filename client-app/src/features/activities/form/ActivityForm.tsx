import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { v4 } from "uuid";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";



function ActivityForm(){

    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        category: '',
        description: '',
        city: '',
        venue: ''
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])

    function handleSubmit(){
        if (!activity.id){
            activity.id = v4();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(res => navigate(`/activities/${activity.id}`));
        }
        
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivity({...activity, [name]:value});
    }

    if(loadingInitial) return <LoadingComponent content="Loading Activity..." />

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <FormInput name="title" value={activity?.title} onChange={handleInputChange} placeholder='Title'/>
                <FormTextArea name="description" value={activity?.description} onChange={handleInputChange} placeholder='Description'/>
                <FormInput name="category" value={activity?.category} onChange={handleInputChange} placeholder='Category'/>
                <FormInput type="date" name="date" value={activity?.date} onChange={handleInputChange} placeholder='Date'/>
                <FormInput name="city" value={activity?.city} onChange={handleInputChange} placeholder='City'/>
                <FormInput name="venue" value={activity?.venue} onChange={handleInputChange} placeholder='Venue'/>
                <Button loading={loading} floated="right" positive type="submit" content="Submit"/>
                <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);