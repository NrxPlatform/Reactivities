import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid, GridColumn} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";



function ActivityDashboard(){
    
    const {activityStore} = useStore();
  
    useEffect(() => {
        activityStore.setLoadingInitial(true);
        activityStore.loadActivities();
    }, [activityStore])

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

    return(
        <Grid>
            <GridColumn width="10">
                <ActivityList />
            </GridColumn>
            <GridColumn width="6">
               <ActivityFilters /> 
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDashboard);