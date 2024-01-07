module "farm/location/form" {
    interface LocationFieldData {
        bcode: string | null;
        address: string | null;
    }
    
    interface LocationFieldFormData {
        location: LocationFieldData;
    }
}
