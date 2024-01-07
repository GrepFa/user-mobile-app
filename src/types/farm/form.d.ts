module "farm/form" {
    import {FarmType} from "farm";
    import {LocationFieldFormData} from "farm/location/form";
    import {PlantFieldFormData} from "farm/plant/form";
    
    interface FarmFieldData {
        id: string | null;
    }
    
    interface FarmFieldFormData {
        farm: FarmFieldData;
    }
    
    interface FarmFormData extends LocationFieldFormData, PlantFieldFormData {
        displayName: string;
        scale: number;
        type: FarmType;
    }
}
