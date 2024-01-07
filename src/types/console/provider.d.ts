module "console/provider" {
    import {Dispatch} from "react";
    import {FarmPreview} from "farm";
    
    interface FarmConsoleState {
        targetFarm: FarmPreview | null;
    }
    
    type FarmConsoleAction = {
        type: "SET_TARGET_FARM",
        data: FarmPreview
    };
    
    type FarmConsoleDispatch = Dispatch<FarmConsoleAction>;
}
