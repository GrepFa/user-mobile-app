module "console/util" {
    import {Dispatch} from "react";
    
    type DataEvent = "CREATE" | "UPDATE" | "DELETE";
    
    interface DataState<Data> {
        isLoading: boolean;
        error: any | undefined;
        data: Data | undefined;
        revalidate: () => void;
    }
    
    type DataAction<Data, Element = Data, Event = DataEvent> = {
        type: "INIT_IS_LOADING";
        isLoading: boolean;
    } | {
        type: "INIT_ERROR";
        error: any | undefined;
    } | {
        type: "INIT_DATA";
        data: Data | undefined;
    } | {
        type: Event;
        data: Element;
    };
    
    type DataDispatch<T> = Dispatch<DataAction<T>>;
    
    interface SelectOption<Value> {
        label: string;
        value: Value;
    }
}
