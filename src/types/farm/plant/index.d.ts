module "farm/plant" {
    interface PlantData {
        id: string;
        displayName: string;
        thumbnail: string | null;
        enable: boolean;
        growthDay: number;
    }
    
    interface PlantPreview {
        id: string;
        displayName: string;
        thumbnail: string | null;
        enable: boolean;
        growthDay: number;
    }
    
    interface PlantListResponse<T> {
        plants: Array<T>;
    }
    
    interface PlantResponse<T> {
        plant: T;
    }
}
