module "farm/channel/actuator/relay" {
    import {ActuatorChannelPreview, ActuatorChannelData, ActuatorChannelType} from "farm/channel/actuator";
    
    type RelayChannelType =  "LED" | "FLUID_FAN" | "VENT_FAN" | ActuatorChannelType;
    
    
    interface RelayChannelPreview extends ActuatorChannelPreview<RelayChannelType> {
    
    }
    
    interface RelayChannelData extends ActuatorChannelData<RelayChannelType> {
    
    }
    
    interface RelayChannelListResponse<T> {
        relays: Array<T>;
    }
    
    interface RelayChannelResponse<T> {
        relay: T;
    }
}
