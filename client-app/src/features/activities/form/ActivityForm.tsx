import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { v4 } from "uuid";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { ActivityFormValues } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { CategoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";



function ActivityForm(){

    const {activityStore} = useStore();
    const {createActivity, updateActivity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required('The activity category is required'),
        date: Yup.string().required('The activity date is required').nullable(),
        city: Yup.string().required('The activity city is required'),
        venue: Yup.string().required('The activity venue is required'),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadActivity])

    function handleFormSubmit(activity: ActivityFormValues){
        if (!activity.id){
           let newActivity = {
                ...activity,
                id: v4()
           }
            createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
        }else{
            updateActivity(activity).then(res => navigate(`/activities/${activity.id}`));
        }
        
    }

    if(loadingInitial) return <LoadingComponent content="Loading Activity..." />

    return(
        <Segment clearing>
            <Formik
                validationSchema={validationSchema} 
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name="title" placeholder="Title" />
                        <MyTextArea rows={3} name="description" placeholder='Description'/>
                        <MySelectInput options={CategoryOptions} name="category" placeholder='Category'/>
                        <MyDateInput 
                            name="date"  
                            placeholderText='Date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                            />
                        <Header content='Location Details' sub color="teal" />
                        <MyTextInput name="city" placeholder='City'/>
                        <MyTextInput name="venue"  placeholder='Venue'/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated="right" 
                            positive type="submit" content="Submit"/>
                        <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/>
                    </Form>
                )}
            </Formik>
            
        </Segment>
    )
}

export default observer(ActivityForm);