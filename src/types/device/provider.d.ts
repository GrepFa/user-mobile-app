module "device/provider" {
    import {DataState, DataAction} from "console/util";
    import {Dispatch} from "react";
    import {DeviceData, DevicePreview} from "device";
    import {MotorModulePreview, RelayModulePreview, SensorModulePreview} from "device/module";
    
    interface DeviceState extends DataState<DeviceData> {
    }
    
    type DeviceAction = DataAction<DeviceData, DeviceData, "UPDATE"> | {
        type: "UPDATE_SENSOR_MODULE",
        data: SensorModulePreview
    } | {
        type: "UPDATE_MOTOR_MODULE",
        data: MotorModulePreview
    } | {
        type: "UPDATE_RELAY_MODULE",
        data: RelayModulePreview
    };
    
    type DeviceDispatch = Dispatch<DeviceAction>;
    
    interface DeviceListState extends DataState<Array<DevicePreview>> {
    }
    
    type DeviceListAction = DataAction<Array<DevicePreview>, DevicePreview>;
    
    type DeviceListDispatch = Dispatch<DeviceListAction>;
}
