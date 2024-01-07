module "farm/environment" {
    import {AutoControlPreview} from "farm/auto/control";
    type EnvironmentType = 
        // 내부 환경
        "INSIDE_CO2" | // 내부 C02
        "INSIDE_HUMIDITY" | // 내부 습도
        "INSIDE_TEMPERATURE" | // 내부 온도
        
        // 외부 환경
        "OUTSIDE_SOLAR_RADIATION" | // 외부 일사량
        "OUTSIDE_TEMPERATURE" | // 외부 온도
        "OUTSIDE_WIND_DIRECTION" | // 외부 풍향
        "OUTSIDE_WIND_SPEED" | // 외부 풍속
        "OUTSIDE_RAINFALL" | // 외부 강우
        
        // 근권(토양) 환경
        "GROUND_MOISTURE" | // 지습
        "GROUND_TEMPERATURE" | // 지온
        "GROUND_EC" | // 토양 EC
        "GROUND_PH"; // 토양 PH
    
    
    interface EnvironmentData {
        id: string;
        displayName: string;
        type: EnvironmentType;
        min: number | null;
        max: number | null
        autoControl: AutoControlPreview;
    }
    
    interface EnvironmentPreview {
        id: string;
        displayName: string;
        type: EnvironmentType;
        min: number | null;
        max: number | null
        autoControlId: string;
    }
    
    interface EnvironmentListResponse<T> {
        environments: Array<T>;
    }
    
    interface EnvironmentResponse<T> {
        environment: T;
    }
}
