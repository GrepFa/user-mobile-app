module "device" {
    import {MotorModulePreview, RelayModulePreview, SensorModulePreview} from "device/module";
    
    interface DeviceData {
        thingName: string;
        typeName: string | null;
        displayName: string | null;
        serial: string | null;
        sensors: Array<SensorModulePreview> | null;
        motors: Array<MotorModulePreview> | null;
        relays: Array<RelayModulePreview> | null;
    }
    
    interface DevicePreview {
        thingName: string;
        typeName: string | null;
        displayName: string | null;
        serial: string | null;
    }
    
    interface DeviceListResponse<T> {
        devices: Array<T>;
    }
    
    interface DeviceResponse<T> {
        device: T;
    }
}
