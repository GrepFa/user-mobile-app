import React, {createContext, useContext, useEffect, useReducer} from "react";
import {AutoControlMotorAction, AutoControlMotorDispatch, AutoControlMotorState} from "farm/auto/control/provider";
import useSWR from "swr";
import {MotorChannelListResponse, MotorChannelPreview} from "farm/channel/actuator/motor";
import { DataFetcher } from "../util";
import { Button, Text, View } from "react-native";
import {DEBUG} from '@env';

const AutoControlMotorStateContext = createContext<AutoControlMotorState | null>(null);
const AutoControlMotorDispatchContext = createContext<AutoControlMotorDispatch | null>(null);

function reducer(state: AutoControlMotorState, action: AutoControlMotorAction): AutoControlMotorState {
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
                data: state.data?.map((motor) => (
                    motor.id == action.data.id ? {
                        ...action.data
                    } : motor
                ))
            }
        case "DELETE":
            return {
                ...state,
                data: state.data?.filter((motor) => motor.id != action.data.id)
            }
        default:
            throw new Error("Unhandled action");
    }
}

interface ChildrenProps {
    motors: Array<MotorChannelPreview>;
}

interface AutoControlMotorProviderProps {
    autoControlId: string;
    children?: (props: ChildrenProps) => React.ReactNode | undefined;
}

function AutoControlMotorProvider({autoControlId, children}: AutoControlMotorProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response
    } = useSWR<MotorChannelListResponse<MotorChannelPreview>>(`/farm/auto/control/${autoControlId}/motor`, DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.motors,
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
            data: response?.motors,
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
        <AutoControlMotorStateContext.Provider value={state}>
            <AutoControlMotorDispatchContext.Provider value={dispatch}>
                {children && children({motors: state.data})}
            </AutoControlMotorDispatchContext.Provider>
        </AutoControlMotorStateContext.Provider>
    )
}

function useAutoControlMotor() {
    const state = useContext(AutoControlMotorStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlMotorStateContext");
        }
        throw new Error("Cannot found AutoControlMotorStateContext");
    }
    return state;
}

function useAutoControlMotorDispatch() {
    const dispatch = useContext(AutoControlMotorDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug("Cannot found AutoControlMotorDispatchContext");
        }
        throw new Error("Cannot found AutoControlMotorDispatchContext");
    }
    return dispatch;
}

export default AutoControlMotorProvider;
export {useAutoControlMotor, useAutoControlMotorDispatch};

