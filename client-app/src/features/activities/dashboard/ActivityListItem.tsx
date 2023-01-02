import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemImage, Label, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";


interface Props{
    activity: Activity
}

export default function ActivityListItem({activity}: Props){

    return(
      <SegmentGroup>
        <Segment>
            {activity.isCancelled && 
                <Label attached="top" color="red" content='cancelled'
                style={{textAlign: 'center'}} />
            }
            <ItemGroup>
                <Item>
                    <ItemImage size="tiny" circular src={activity.host?.image || '/assets/user.png'} />
                    <ItemContent>
                        <ItemHeader as={Link} to={`/activites/${activity.id}`}>
                            {activity.title}
                        </ItemHeader>
                        <ItemDescription>Hosted by <Link to={`/profiles/${activity.hostUserName}`}>{activity.host?.displayName}</Link></ItemDescription>
                        {activity.isHost && (
                            <ItemDescription>
                                <Label basic color="orange">
                                    you are hosting this activity
                                </Label>
                            </ItemDescription>
                        )}
                        {activity.isGoing && !activity.isHost && (
                            <ItemDescription>
                                <Label basic color="green">
                                    you are going to this activity
                                </Label>
                            </ItemDescription>
                        )}
                    </ItemContent>
                </Item>                
            </ItemGroup>
        </Segment>
        <Segment>
            <span>
                <Icon name="clock" /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                <Icon name="marker" /> {activity.venue}
            </span>
        </Segment>
        <Segment secondary>
            <ActivityListItemAttendee attendees={activity.attendees!} />
        </Segment>
        <Segment clearing>
            <span>{activity.description}</span>
            <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated="right" content="View"/>
        </Segment>
      </SegmentGroup>
    )
}