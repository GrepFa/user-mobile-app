module "device/module" {
    type ModuleControlMode = "LOCAL" | "REMOTE";
    
    interface ModulePreview {
        thingName: string;
        port: string;
    }
    
    type SensorModuleModel = "TEMPERATURE_SENSOR" | "HUMIDITY_SENSOR" |
        "CO2_SENSOR" | "SOLAR_RADIATION_SENSOR" |
        "WIND_DIRECTION_SENSOR" | "WIND_SPEED_SENSOR" |
        "RAINFALL_SENSOR" | "PHOTON_SENSOR" |
        "GROUND_MOISTURE_SENSOR" | "GROUND_MOISTURE_TENSION_SENSOR" |
        "EC_SENSOR" | "PH_SENSOR" | "GROUND_TEMPERATURE_SENSOR";
    
    interface SensorModulePreview extends ModulePreview {
        model: SensorModuleModel;
        status: number;
        statusUpdated: number;
    }
    
    interface MotorModulePreview extends ModulePreview {
        control: ModuleControlMode;
        status: number;
        statusUpdated: number;
        level: number;
        maxLevel: number;
    }
    
    interface RelayModulePreview extends ModulePreview {
        control: ModuleControlMode;
        status: number;
        statusUpdated: number;
    }
    
    interface SensorModuleListResponse<T> {
        sensors: Array<T>;
    }
    
    interface SensorModuleResponse<T> {
        sensor: T;
    }
    
    interface MotorModuleListResponse<T> {
        motors: Array<T>;
    }
    
    interface MotorModuleResponse<T> {
        motor: T;
    }
    
    interface RelayModuleListResponse<T> {
        relays: Array<T>;
    }
    
    interface RelayModuleResponse<T> {
        relay: T;
    }
}
