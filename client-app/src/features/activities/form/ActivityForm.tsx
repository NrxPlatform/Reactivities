import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";



function ActivityForm(){

    const {activityStore} = useStore();
    const {selectedActivity, closeForm, createActivity, updateActivity, loading} = activityStore;
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        category: '',
        description: '',
        city: '',
        venue: ''
    }
    const [activity, setActivity] = useState(initialState);

    function handleSubmit(){
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivity({...activity, [name]:value});
    }

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
                <Button onClick={closeForm} floated="right" type="button" content="Cancel"/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);