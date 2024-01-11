'use client';

import React, {createContext, useCallback, useContext, useEffect, useReducer} from 'react';
import {
    MotorModuleListState, MotorModuleListDispatch, MotorModuleListAction,
} from 'device/module/provider';
import { DataFetcher } from '../../util';
import useSWR from 'swr';
import {
    MotorModuleListResponse,
    MotorModulePreview,
} from 'device/module';
import { useIotCore } from '../../amplify/IotCoreProvider';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import {DEBUG} from '@env';
import moment from 'moment';
import {Text} from "react-native";

const MotorModuleListStateContext = createContext<MotorModuleListState | null>(null);
const MotorModuleListDispatchContext = createContext<MotorModuleListDispatch | null>(null);

function calculateMotorStatus(module: MotorModulePreview, newState: number, newStatusUpdated: number): MotorModulePreview {
    const updatedBetween = newStatusUpdated - module.statusUpdated;
    const newLevel = module.level + (module.status * updatedBetween);
    return {
        ...module,
        status: newState,
        statusUpdated: newStatusUpdated,
        level: Math.min(module.maxLevel, Math.max(0, newLevel)),
    };
}

function initMotor(module: MotorModulePreview): MotorModulePreview {
    const now = moment().unix();
    const updatedBetween = now - module.statusUpdated;
    const newLevel = module.level + (module.status * updatedBetween);
    return {
        ...module,
        level: Math.min(module.maxLevel, Math.max(0, newLevel)),
        statusUpdated: now,
    };
}

function reducer(state: MotorModuleListState, action: MotorModuleListAction): MotorModuleListState {
    switch (action.type) {
        case 'INIT_IS_LOADING':
            return {
                ...state,
                isLoading: action.isLoading,
            };
        case 'INIT_ERROR':
            return {
                ...state,
                error: action.error,
            };
        case 'INIT_DATA':
            return {
                ...state,
                data: action.data,
            };
        case 'CREATE':
            return {
                ...state,
                data: state.data?.concat(action.data),
            };
        case 'UPDATE':
            // noinspection DuplicatedCode
            return {
                ...state,
                data: state.data?.map((motor) =>
                    motor.thingName === action.data.thingName && motor.port === action.data.port ? {
                        ...motor,
                        control: action.data.control ?? motor.control,
                        ...((action.data.status != null && action.data.statusUpdated != null) && {
                            ...calculateMotorStatus(motor, action.data.status, action.data.statusUpdated),
                        }),
                    } : motor
                ),
            };
        case 'DELETE':
            return {
                ...state,
                data: state.data?.filter((motor) =>
                    motor.thingName !== action.data.thingName && motor.port !== action.data.port
                ),
            };
        default:
            throw new Error('Unhandled action');
    }
}

interface ChildrenProps extends MotorModuleListState {
    motors: Array<MotorModulePreview>;
}

interface MotorModuleListDataProviderProps {
    children: (props: ChildrenProps) => React.ReactNode;
}

function MotorModuleListProvider({children}: MotorModuleListDataProviderProps) {
    const {user} = useAuthenticator((context) => [context.user]);
    const {client} = useIotCore();
    const {
        error,
        isLoading,
        mutate,
        data: response,
    } = useSWR<MotorModuleListResponse<MotorModulePreview>>('/device/motor', DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.motors,
    });
    const {data} = state;
    const motorUpdateHandler = useCallback((motorModules: any) => {
        for (const motorModule of motorModules) {
            dispatch({
                type: 'UPDATE',
                data: motorModule,
            });
        }
    }, []);
    useEffect(() => {
        dispatch({
            type: 'INIT_ERROR',
            error: error,
        });
    }, [error]);
    useEffect(() => {
        dispatch({
            type: 'INIT_IS_LOADING',
            isLoading: isLoading,
        });
    }, [isLoading]);
    useEffect(() => {
        dispatch({
            type: 'INIT_DATA',
            data: response?.motors,
        });
    }, [response]);
    useEffect(() => {
        const motorUpdateSubscription = client.subscribe({
            topics: `user/${user.userId}/device/motor/update`,
        }).subscribe({
            next: motorUpdateHandler,
        });
        return () => {
            motorUpdateSubscription.unsubscribe();
        };
    }, [user, client, motorUpdateHandler]);
    if (!data) {
        return (
            <Text>로딩중...</Text>
        );
    }
    return (
        <MotorModuleListStateContext.Provider value={state}>
            <MotorModuleListDispatchContext.Provider value={dispatch}>
                {children({
                    ...state,
                    motors: data,
                })}
            </MotorModuleListDispatchContext.Provider>
        </MotorModuleListStateContext.Provider>
    );
}

function useMotorModuleList() {
    const state = useContext(MotorModuleListStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found MotorModuleListStateContext');
        }
        throw new Error('Cannot found MotorModuleListStateContext');
    }
    return state;
}

function useMotorModuleListDispatch() {
    const dispatch = useContext(MotorModuleListDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found MotorModuleListDispatchContext');
        }
        throw new Error('Cannot found MotorModuleListDispatchContext');
    }
    return dispatch;
}

export default MotorModuleListProvider;
export {useMotorModuleList, useMotorModuleListDispatch, calculateMotorStatus, initMotor};

