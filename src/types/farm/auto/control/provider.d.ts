module "farm/auto/control/provider" {
    import {DataState, DataAction} from "console/util";
    import {ActuatorChannelPreview} from "farm/channel/actuator";
    import {MotorChannelPreview} from "farm/channel/actuator/motor";
    import {RelayChannelPreview} from "farm/channel/actuator/relay";
    import {EnvironmentPreview} from "farm/environment";
    import {Dispatch} from "react";
    
    interface AutoControlActuatorState<Channel extends ActuatorChannelPreview<?>> extends DataState<Array<Channel>> {
    }
    
    type AutoControlActuatorAction<Channel extends ActuatorChannelPreview<?>> = DataAction<Array<Channel>, Channel, "UPDATE" | "DELETE">;
    
    type AutoControlActuatorDispatch<Channel extends ActuatorChannelPreview<?>> = Dispatch<AutoControlActuatorAction<Channel>>;
    
    interface AutoControlMotorState extends AutoControlActuatorState<MotorChannelPreview> {
    }
    
    type AutoControlMotorAction = AutoControlActuatorAction<MotorChannelPreview>;
    
    type AutoControlMotorDispatch = AutoControlActuatorDispatch<MotorChannelPreview>;
    
    
    interface AutoControlRelayState extends AutoControlActuatorState<RelayChannelPreview> {
    }
    
    type AutoControlRelayAction = AutoControlActuatorAction<RelayChannelPreview>;
    
    type AutoControlRelayDispatch = AutoControlActuatorDispatch<RelayChannelPreview>;
    
    
    interface AutoControlEnvironmentState extends DataState<Array<EnvironmentPreview>> {
    }
    
    type AutoControlEnvironmentAction = DataAction<Array<EnvironmentPreview>, EnvironmentPreview, "UPDATE" | "DELETE">;
    
    type AutoControlEnvironmentDispatch = Dispatch<AutoControlEnvironmentAction>;
}
