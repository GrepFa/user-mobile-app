module "farm/channel/actuator/form" {
    import {AutoControlFieldFormData} from "farm/auto/control/form";
    import {ActuatorChannelType} from "farm/channel/actuator/motor";
    import {ChannelFormData, ChannelModuleFieldFormData} from "farm/channel/form";
    
    interface ActuatorChannelFormData<Type extends ActuatorChannelType> extends ChannelFormData<Type>, AutoControlFieldFormData {
        enable: boolean;
    }
}
