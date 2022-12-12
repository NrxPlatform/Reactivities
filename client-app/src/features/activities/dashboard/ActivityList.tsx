import React, { SyntheticEvent, useState } from "react";
import { Button, Item, ItemContent, ItemDescription, ItemExtra, ItemGroup, ItemHeader, ItemMeta, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props{
    activities: Activity[];
    selectActivity: (id : string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props){
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: any, id: string){
        setTarget(e.target.name)
        //SyntheticEvent<HTMLButtonElement> setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    
    return(
        <Segment>
            <ItemGroup divided>
                {activities.map((activity: Activity, index: number) => (
                    <Item key={activity.id}>
                        <ItemContent>
                            <ItemHeader as='a'>{activity.title}</ItemHeader>
                            <ItemMeta>{activity.date}</ItemMeta>
                            <ItemDescription>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </ItemDescription>
                            <ItemExtra>
                                <Button onClick={() => selectActivity(activity.id)} floated="right" content='View' color="blue" />
                                <Button 
                                    name={activity.id}
                                    loading={submitting && target === activity.id} 
                                    onClick={(e) => handleActivityDelete(e,activity.id)} floated="right" content='Delete' color="red" />
                                <Label basic content={activity.category} />
                            </ItemExtra>
                        </ItemContent>
                    </Item>
                ))}
            </ItemGroup>
        </Segment>
    )

}