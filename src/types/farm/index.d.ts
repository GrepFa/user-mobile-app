module "farm" {
    type FarmType = "SINGLE" | "MULTI";
    
    interface FarmLocation {
        bcode: string | null;
        address: string | null;
    }
    
    interface FarmPlant {
        id: string | null;
        displayName: string | null;
        thumbnail: string | null;
        sowing: string | null;
    }
    
    interface FarmData {
        id: string;
        displayName: string;
        scale: number;
        type: FarmType;
        location: FarmLocation;
        plant: FarmPlant;
    }
    
    interface FarmPreview {
        id: string;
        displayName: string;
        scale: number;
        type: FarmType;
    }
    
    interface FarmListResponse<T> {
        farms: Array<T>;
    }
    
    interface FarmResponse<T> {
        farm: T;
    }
}
