module "farm/auto/control" {
    import {FarmPreview} from "farm";
    
    type AutoControlType = "SIMPLE" | "COMPLEX";
    
    type AutoControlOptionType = "TEMPERATURE" | "HUMIDITY" | "CO2";
    
    interface AutoControlOption {
        sideWindowControl: string | null;
        ceilingWindowControl: string | null;
        lightCurtainControl: string | null;
        warnCurtainControl: string | null;
        fluidFanControl: string | null;
        ventFanControl: string | null;
    }
    
    interface AutoControlData {
        id: string;
        displayName: string;
        type: AutoControlType;
        enable: boolean;
        option: AutoControlOption | null;
        farm: FarmPreview;
    }
    
    interface AutoControlPreview {
        id: string;
        displayName: string;
        type: AutoControlType;
        enable: boolean;
        option: AutoControlOption | null;
        farmId: string;
    }
    
    interface AutoControlListResponse<T> {
        autoControls: Array<T>;
    }
    
    interface AutoControlResponse<T> {
        autoControl: T;
    }
}
