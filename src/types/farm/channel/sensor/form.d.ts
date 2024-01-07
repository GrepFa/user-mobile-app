module "farm/channel/sensor/form" {
    import {ActuatorChannelType} from "farm/channel/actuator/motor";
    import {ChannelFormData,} from "farm/channel/form";
    import {SensorChannelType} from "farm/channel/sensor";
    import {EnvironmentFieldFormData} from "farm/environment/form";
    
    interface SensorChannelFormData extends ChannelFormData<SensorChannelType>, EnvironmentFieldFormData {
    }
}
