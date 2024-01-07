module "farm/channel" {
    type ChannelType = string;
    
    interface ChannelModule {
        thingName: string;
        port: string;
    }
    
    interface ChannelPreview<Type extends ChannelType> {
        id: string;
        displayName: string;
        type: Type;
        module: ChannelModule | null;
    }
    
    interface ChannelData<Type extends ChannelType> {
        id: string;
        displayName: string;
        type: Type;
        module: ChannelModule | null;
    }
}
