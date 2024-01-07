module "ui" {
    import React from "react";
    
    interface NavItem {
        label: string;
        icon: React.ReactNode;
        path: string;
    }
    
    export interface DropDownMenuItem {
        label: string;
        icon: string;
        onClick: () => void;
        divider?: React.ReactNode | undefined;
    }
    
    interface backgroundBlurOptions {
        color?: string | undefined;
        blur?: number | undefined;
        opacity?: number | undefined;
        imgUrl?: string | undefined;
    }
}
