module "farm/channel/actuator" {
    import {ChannelData, ChannelPreview, ChannelType} from "farm/channel";
    import {AutoControlPreview} from "farm/auto/control";
    type ActuatorChannelType = ChannelType;
    
    interface ActuatorChannelPreview<Type extends ActuatorChannelType> extends ChannelPreview<Type> {
        enable: boolean;
        autoControlId: string;
    }
    
    interface ActuatorChannelData<Type extends ActuatorChannelType> extends ChannelData<Type> {
        enable: boolean;
        autoControl: AutoControlPreview;
    }
}
