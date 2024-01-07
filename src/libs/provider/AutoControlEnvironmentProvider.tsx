import React, {createContext, useContext, useEffect, useReducer} from "react";
import {AutoControlEnvironmentAction, AutoControlEnvironmentDispatch, AutoControlEnvironmentState} from "farm/auto/control/provider";
import useSWR from "swr";
import {EnvironmentListResponse, EnvironmentPreview} from "farm/environment";
import {DEBUG} from '@env';
import { DataFetcher } from "../util";
import { Button, Text, View } from "react-native";

const AutoControlEnvironmentStateContext = createContext<AutoControlEnvironmentState | null>(null);
const AutoControlEnvironmentDispatchContext = createContext<AutoControlEnvironmentDispatch | null>(null);

function reducer(state: AutoControlEnvironmentState, action: AutoControlEnvironmentAction): AutoControlEnvironmentState {
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
        case "UPDATE":
            return {
                ...state,
                data: state.data?.map((environment) => (
                    environment.id == action.data.id ? {
                        ...action.data
                    } : environment
                ))
            }
        case "DELETE":
            return {
                ...state,
                data: state.data?.filter((environment) => environment.id != action.data.id)
            }
        default:
            throw new Error("Unhandled action");
    }
}

interface ChildrenProps {
    environments: Array<EnvironmentPreview>;
}

interface AutoControlEnvironmentProviderProps {
    autoControlId: string;
    children?: (props: ChildrenProps) => React.ReactNode | undefined;
}

function AutoControlEnvironmentProvider({autoControlId, children}: AutoControlEnvironmentProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response
    } = useSWR<EnvironmentListResponse<EnvironmentPreview>>(`/farm/auto/control/${autoControlId}/environment`, DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.environments
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
            data: response?.environments,
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
        <AutoControlEnvironmentStateContext.Provider value={state}>
            <AutoControlEnvironmentDispatchContext.Provider value={dispatch}>
                {children && children({environments: state.data})}
            </AutoControlEnvironmentDispatchContext.Provider>
        </AutoControlEnvironmentStateContext.Provider>
    )
}

function useAutoControlEnvironment() {
    const state = useContext(AutoControlEnvironmentStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlEnvironmentStateContext");
        }
        throw new Error("Cannot found AutoControlEnvironmentStateContext");
    }
    return state;
}

function useAutoControlEnvironmentDispatch() {
    const dispatch = useContext(AutoControlEnvironmentDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlEnvironmentDispatchContext");
        }
        throw new Error("Cannot found AutoControlEnvironmentDispatchContext");
    }
    return dispatch;
}

export default AutoControlEnvironmentProvider;
export {useAutoControlEnvironment, useAutoControlEnvironmentDispatch};

