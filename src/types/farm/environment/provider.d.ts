module "farm/environment/provider" {
    import {DataAction, DataState} from "console/util";
    import {Dispatch} from "react";
    import {SensorChannelPreview} from "farm/channel/sensor";
    
    interface EnvironmentSensorState extends DataState<Array<SensorChannelPreview>> {
    }
    
    type EnvironmentSensorAction = DataAction<Array<SensorChannelPreview>, SensorChannelPreview, undefined>;
    
    type EnvironmentSensorDispatch = Dispatch<EnvironmentSensorAction>;
}
