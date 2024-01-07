module "farm/plant/form" {
    interface PlantFieldData {
        id: string | null;
        sowing: string | null;
    }
    
    interface PlantFieldFormData {
        plant: PlantFieldData;
    }
    
    interface PlantFormData {
        displayName: string;
        thumbnail: string | null;
        enable: boolean;
        growthDay: number;
    }
}
