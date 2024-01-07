module "util/mqtt" {
    import {Dispatch} from "react";
    import {PubSub} from "@aws-amplify/pubsub";
    
    interface IotCoreState {
        client: PubSub;
    }
    
    type IotCoreAction = {
    
    }
    
    type IotCoreDispatch = Dispatch<IotCoreAction>;
}
