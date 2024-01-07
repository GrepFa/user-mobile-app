"use client";

import React, {createContext, useContext, useEffect, useReducer} from "react";
import {AutoControlRelayAction, AutoControlRelayDispatch, AutoControlRelayState} from "farm/auto/control/provider";
import useSWR from "swr";
import {RelayChannelListResponse, RelayChannelPreview} from "farm/channel/actuator/relay";
import {DEBUG} from '@env';
import { Button, Text, View } from "react-native";
import { DataFetcher } from "../util";

const AutoControlRelayStateContext = createContext<AutoControlRelayState | null>(null);
const AutoControlRelayDispatchContext = createContext<AutoControlRelayDispatch | null>(null);

function reducer(state: AutoControlRelayState, action: AutoControlRelayAction): AutoControlRelayState {
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
                data: state.data?.map((relay) => (
                    relay.id == action.data.id ? {
                        ...action.data
                    } : relay
                ))
            }
        case "DELETE":
            return {
                ...state,
                data: state.data?.filter((relay) => relay.id != action.data.id)
            }
        default:
            throw new Error("Unhandled action");
    }
}

interface ChildrenProps {
    relays: Array<RelayChannelPreview>;
}

interface AutoControlRelayProviderProps {
    autoControlId: string;
    children?: (props: ChildrenProps) => React.ReactNode | undefined;
}

function AutoControlRelayProvider({autoControlId, children}: AutoControlRelayProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response
    } = useSWR<RelayChannelListResponse<RelayChannelPreview>>(`/farm/auto/control/${autoControlId}/relay`, DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.relays,
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
            data: response?.relays,
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
        <AutoControlRelayStateContext.Provider value={state}>
            <AutoControlRelayDispatchContext.Provider value={dispatch}>
                {children && children({relays: state.data})}
            </AutoControlRelayDispatchContext.Provider>
        </AutoControlRelayStateContext.Provider>
    )
}

function useAutoControlRelay() {
    const state = useContext(AutoControlRelayStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlRelayStateContext");
        }
        throw new Error("Cannot found AutoControlRelayStateContext");
    }
    return state;
}

function useAutoControlRelayDispatch() {
    const dispatch = useContext(AutoControlRelayDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlRelayDispatchContext");
        }
        throw new Error("Cannot found AutoControlRelayDispatchContext");
    }
    return dispatch;
}

export default AutoControlRelayProvider;
export {useAutoControlRelay, useAutoControlRelayDispatch};

