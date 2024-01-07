module "device/module/provider" {
    import {DataAction, DataState} from "console/util";
    import {Dispatch} from "react";
    import {ModulePreview, MotorModulePreview, RelayModulePreview, SensorModulePreview} from "device/module";
    
    interface ModuleListState<Preview extends ModulePreview> extends DataState<Array<Preview>> {}
    
    type ModuleListAction<Preview extends ModulePreview> = DataAction<Array<Preview>, Preview>;
    
    type ModuleListDispatch<Preview extends ModulePreview> = Dispatch<DataAction<Array<Preview>, Preview>>;
    
    interface MotorModuleListState extends ModuleListState<MotorModulePreview> {}
    
    type MotorModuleListAction = ModuleListAction<MotorModulePreview>;
    
    type MotorModuleListDispatch = ModuleListDispatch<MotorModulePreview>;
    
    interface RelayModuleListState extends ModuleListState<RelayModulePreview> {}
    
    type RelayModuleListAction = ModuleListAction<RelayModulePreview>;
    
    type RelayModuleListDispatch = ModuleListDispatch<RelayModulePreview>;
    
    
    interface SensorModuleListState extends ModuleListState<SensorModulePreview> {}
    
    type SensorModuleListAction = ModuleListAction<SensorModulePreview>;
    
    type SensorModuleListDispatch = ModuleListDispatch<SensorModulePreview>;
}
