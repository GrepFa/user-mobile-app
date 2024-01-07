module "farm/channel/actuator/relay/form" {
    import {ActuatorChannelFormData} from "farm/channel/actuator/form";
    import {RelayChannelType} from "farm/channel/actuator/relay";
    
    interface RelayChannelFormData extends ActuatorChannelFormData<RelayChannelType>{
    }
}
