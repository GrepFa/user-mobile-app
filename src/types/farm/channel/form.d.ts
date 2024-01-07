module "farm/channel/form" {
    import {ChannelType} from "farm/channel";
    
    interface ChannelModuleFieldData {
        thingName: string | null;
        port: string | null;
    }
    
    interface ChannelModuleFieldFormData {
        module: ChannelModuleFieldData | null;
    }
    
    interface ChannelFormData<Type extends ChannelType> extends ChannelModuleFieldFormData {
        displayName: string;
        type: Type | null;
    }
}
