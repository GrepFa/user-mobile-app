module "farm/provider" {
    import {DataAction, DataState} from "console/util";
    import {Dispatch} from "react";
    import {FarmPreview} from "farm";
    import {AutoControlPreview} from "farm/auto/control";
    
    interface FarmAutoControlState extends DataState<Array<AutoControlPreview>> {
    }
    
    type FarmAutoControlAction = DataAction<Array<AutoControlPreview>, AutoControlPreview, "UPDATE" | "DELETE">;
    
    type FarmAutoControlDispatch = Dispatch<FarmAutoControlAction>;
    
    
    interface FarmListState extends DataState<Array<FarmPreview>> {
    }
    
    type FarmListAction = DataAction<Array<FarmPreview>, FarmPreview>;
    
    type FarmListDispatch = Dispatch<FarmListAction>;
}
