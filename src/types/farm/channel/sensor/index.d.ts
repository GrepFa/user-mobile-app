module "farm/channel/sensor" {
    import {ChannelData, ChannelPreview, ChannelType} from "farm/channel";
    import {EnvironmentPreview} from "farm/environment";
    type SensorChannelType = "TEMPERATURE_SENSOR" | "HUMIDITY_SENSOR" |
        "CO2_SENSOR" | "SOLAR_RADIATION_SENSOR" |
        "WIND_DIRECTION_SENSOR" | "WIND_SPEED_SENSOR" |
        "RAINFALL_SENSOR" | "PHOTON_SENSOR" |
        "GROUND_MOISTURE_SENSOR" | "GROUND_MOISTURE_TENSION_SENSOR" |
        "EC_SENSOR" | "PH_SENSOR" | "GROUND_TEMPERATURE_SENSOR" | ChannelType;
    
    interface SensorChannelPreview extends ChannelPreview<SensorChannelType> {
        environmentId: string;
    }
    
    interface SensorChannelData extends ChannelData<SensorChannelType> {
        environment: EnvironmentPreview;
    }
    
    interface SensorChannelListResponse<T> {
        sensors: Array<T>;
    }
    
    interface SensorChannelResponse<T> {
        sensor: T;
    }
}
