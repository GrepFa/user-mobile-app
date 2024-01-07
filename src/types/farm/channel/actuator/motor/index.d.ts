module "farm/channel/actuator/motor" {
    import {ActuatorChannelPreview, ActuatorChannelData, ActuatorChannelType} from "farm/channel/actuator";
    
    type MotorChannelType =  "LEFT_FIRST_SIDE_WINDOW" | "RIGHT_FIRST_SIDE_WINDOW" |
        "LEFT_SECOND_SIDE_WINDOW" | "RIGHT_SECOND_SIDE_WINDOW" |
        
        // 천창
        "LEFT_FIRST_CEILING_WINDOW" | "RIGHT_FIRST_CEILING_WINDOW" |
        "LEFT_SECOND_CEILING_WINDOW" | "RIGHT_SECOND_CEILING_WINDOW" |
        
        // 차광 커튼
        "LEFT_LIGHT_CURTAIN" | "RIGHT_LIGHT_CURTAIN" |
        
        // 보온 커튼
        "LEFT_WARM_CURTAIN" | "RIGHT_WARM_CURTAIN" | ActuatorChannelType;
 
    
    interface MotorChannelPreview extends ActuatorChannelPreview<MotorChannelType> {
    
    }
    
    interface MotorChannelData extends ActuatorChannelData<MotorChannelType> {
    
    }
    
    interface MotorChannelListResponse<T> {
        motors: Array<T>;
    }
    
    interface MotorChannelResponse<T> {
        motor: T;
    }
}
