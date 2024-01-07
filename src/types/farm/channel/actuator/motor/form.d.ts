module "farm/channel/actuator/motor/form" {
    import {MotorChannelType} from "farm/channel/actuator/motor";
    import {ActuatorChannelFormData} from "farm/channel/actuator/form";
    
    interface MotorChannelFormData extends ActuatorChannelFormData<MotorChannelType> {
    }
}
