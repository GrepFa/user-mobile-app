'use client';

import React, {createContext, useCallback, useContext, useEffect, useReducer} from 'react';
import {
    SensorModuleListState, SensorModuleListDispatch, SensorModuleListAction,
} from 'device/module/provider';
import useSWR from 'swr';
import {SensorModuleListResponse, SensorModulePreview} from 'device/module';
import {DEBUG} from '@env';
import { useIotCore } from '../../amplify/IotCoreProvider';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { DataFetcher } from '../../util';

const SensorModuleListStateContext = createContext<SensorModuleListState | null>(null);
const SensorModuleListDispatchContext = createContext<SensorModuleListDispatch | null>(null);

function reducer(state: SensorModuleListState, action: SensorModuleListAction): SensorModuleListState {
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
                data: state.data?.map((sensor) =>
                    sensor.thingName === action.data.thingName && sensor.port === action.data.port ? {
                        ...sensor,
                        model: action.data.model ?? sensor.model,
                        status: action.data.status ?? sensor.status,
                        statusUpdated: action.data.statusUpdated ?? sensor.statusUpdated,
                    } : sensor
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

interface SensorModuleListDataProviderProps {
    children?: React.ReactNode | undefined;
}

function SensorModuleListProvider({children}: SensorModuleListDataProviderProps) {
    const {user} = useAuthenticator((context) => [context.user]);
    const {client} = useIotCore();
    const {
        error,
        isLoading,
        mutate,
        data: response,
    } = useSWR<SensorModuleListResponse<SensorModulePreview>>('/device/sensor', DataFetcher);
    // noinspection DuplicatedCode
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.sensors,
    });
    const sensorUpdateHandler = useCallback((sensorModules: any) => {
        for (const sensorModule of sensorModules) {
            dispatch({
                type: 'UPDATE',
                data: sensorModule,
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
            data: response?.sensors,
        });
    }, [response]);
    useEffect(() => {
        const sensorUpdateSubscription = client.subscribe({
            topics: `user/${user.userId}/device/sensor/update`,
        }).subscribe({
            next: sensorUpdateHandler,
        });
        return () => {
            sensorUpdateSubscription.unsubscribe();
        };
    }, [user, client, sensorUpdateHandler]);
    return (
        <SensorModuleListStateContext.Provider value={state}>
            <SensorModuleListDispatchContext.Provider value={dispatch}>
                {children}
            </SensorModuleListDispatchContext.Provider>
        </SensorModuleListStateContext.Provider>
    );
}

function useSensorModuleList() {
    const state = useContext(SensorModuleListStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found SensorModuleListStateContext');
        }
        throw new Error('Cannot found SensorModuleListStateContext');
    }
    return state;
}

function useSensorModuleListDispatch() {
    const dispatch = useContext(SensorModuleListDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found SensorModuleListDispatchContext');
        }
        throw new Error('Cannot found SensorModuleListDispatchContext');
    }
    return dispatch;
}

export default SensorModuleListProvider;
export {useSensorModuleList, useSensorModuleListDispatch};

