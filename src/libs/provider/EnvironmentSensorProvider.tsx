import React, {createContext, useContext, useEffect, useReducer} from "react";
import useSWR from "swr";
import {EnvironmentSensorAction, EnvironmentSensorDispatch, EnvironmentSensorState} from "farm/environment/provider";
import {SensorChannelListResponse, SensorChannelPreview} from "farm/channel/sensor";
import { Button, Text, View } from "react-native";
import {DEBUG} from "@env";
import { DataFetcher } from "../util";

const EnvironmentSensorStateContext = createContext<EnvironmentSensorState | null>(null);
const EnvironmentSensorDispatchContext = createContext<EnvironmentSensorDispatch | null>(null);

function reducer(state: EnvironmentSensorState, action: EnvironmentSensorAction): EnvironmentSensorState {
    switch (action.type) {
        case "INIT_IS_LOADING":
            return {
                ...state,
                isLoading: action.isLoading
            }
        case "INIT_ERROR":
            return {
                ...state,
                error: action.error
            }
        case "INIT_DATA":
            return {
                ...state,
                data: action.data
            }
        default:
            throw new Error("Unhandled action");
    }
}

interface ChildrenProps {
    sensors: Array<SensorChannelPreview>;
}

interface EnvironmentSensorProviderProps {
    environmentId: string;
    children?: (props: ChildrenProps) => React.ReactNode | undefined;
}

function EnvironmentSensorProvider({environmentId, children}: EnvironmentSensorProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response
    } = useSWR<SensorChannelListResponse<SensorChannelPreview>>(`/farm/environment/${environmentId}/sensor`, DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.sensors
    });
    
    useEffect(() => {
        dispatch({
            type: "INIT_ERROR",
            error: error
        })
    }, [error]);
    
    useEffect(() => {
        dispatch({
            type: "INIT_IS_LOADING",
            isLoading: isLoading
        })
    }, [isLoading]);
    
    useEffect(() => {
        dispatch({
            type: "INIT_DATA",
            data: response?.sensors,
        })
    }, [response]);
    
    
    if (isLoading) {
        return (
            <Text>로딩중...</Text>
        )
    }
    
    if (error || !response || !state.data) {
        return (
          <View>
              <Text>오류가 발생하였습니다.</Text>
              <Text>오류: {JSON.stringify(error) ?? '알 수 없는 이유로 발생하였습니다.'}</Text>
              <Button onPress={() => mutate()} title="새로 고침"/>
          </View>
        )
    }
    
    return (
        <EnvironmentSensorStateContext.Provider value={state}>
            <EnvironmentSensorDispatchContext.Provider value={dispatch}>
                {children && children({sensors: state.data})}
            </EnvironmentSensorDispatchContext.Provider>
        </EnvironmentSensorStateContext.Provider>
    )
}

function useEnvironmentSensor() {
    const state = useContext(EnvironmentSensorStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug("Cannot found EnvironmentSensorStateContext");
        }
        throw new Error("Cannot found EnvironmentSensorStateContext");
    }
    return state;
}

function useEnvironmentSensorDispatch() {
    const dispatch = useContext(EnvironmentSensorDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug("Cannot found EnvironmentSensorDispatchContext");
        }
        throw new Error("Cannot found EnvironmentSensorDispatchContext");
    }
    return dispatch;
}

export default EnvironmentSensorProvider;
export {useEnvironmentSensor, useEnvironmentSensorDispatch};

