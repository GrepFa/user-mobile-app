module "farm/environment/form" {
    import {AutoControlFieldData} from "farm/auto/control/form";
    import {EnvironmentType} from "farm/environment";
    import {SensorChannelType} from "farm/channel/sensor";
    
    interface EnvironmentFieldData {
        autoControlId: string | null;
        id: string | null;
        type: EnvironmentType | null;
    }
    
    interface EnvironmentFieldFormData {
        type: SensorChannelType | null;
        environment: EnvironmentFieldData;
    }
    
    interface EnvironmentFormData {
        displayName: string;
        type: EnvironmentType | null;
        min: number | null;
        max: number | null
        autoControl: AutoControlFieldData;
    }
}
