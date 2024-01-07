module "farm/auto/control/form" {
    import {FarmFieldFormData} from "farm/form";
    import {AutoControlType} from "farm/auto/control";
    
    interface AutoControlFieldData {
        farmId: string | null;
        id: string | null;
    }
    
    interface AutoControlFieldFormData {
        autoControl: AutoControlFieldData;
    }
    
    type ControlChannelType =
        "sideWindowControl" |
        "ceilingWindowControl" |
        "lightCurtainControl" |
        "warnCurtainControl" |
        "fluidFanControl" |
        "ventFanControl";
    
    type AutoControlOptionFieldData = Record<ControlChannelType, string | null>;
    
    interface AutoControlOptionFieldFormData {
        option: AutoControlOptionFieldData | null;
    }
    
    interface AutoControlFormData extends FarmFieldFormData, AutoControlOptionFieldFormData {
        displayName: string;
        type: AutoControlType;
        enable: boolean;
    }
}
