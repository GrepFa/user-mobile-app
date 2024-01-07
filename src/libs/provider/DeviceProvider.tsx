'use client';

import React, {createContext, useCallback, useContext, useEffect, useReducer} from 'react';
import {DeviceAction, DeviceDispatch, DeviceState} from 'device/provider';
import {DeviceData, DeviceResponse} from 'device';
import useSWR from 'swr';
import { calculateMotorStatus, initMotor } from './module/MotorModuleListProvider';
import {DEBUG} from '@env';
import { useIotCore } from '../amplify/IotCoreProvider';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { DataFetcher } from '../util';

const DeviceStateContext = createContext<DeviceState | null>(null);
const DeviceDispatchContext = createContext<DeviceDispatch | null>(null);

function reducer(state: DeviceState, action: DeviceAction): DeviceState {
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
                data: action.data !== undefined ? {
                    ...action.data,
                    ...(action.data.motors != null && {
                        motors: action.data.motors.map(initMotor),
                    }),
                } : action.data,
            };
        case 'UPDATE':
            return {
                ...state,
                ...(state.data != null && {
                    data: {
                        ...action.data,
                        sensors: state.data.sensors,
                        motors: state.data.motors,
                        relays: state.data.relays,
                    },
                }),
            };
        case 'UPDATE_SENSOR_MODULE' :
            return {
                ...state,
                ...(state.data != null && {
                    data: {
                        ...state.data,
                        ...(state.data.sensors != null && {
                            sensors: state.data.sensors.map((sensor) => (
                                sensor.thingName === action.data.thingName && sensor.port === action.data.port ? {
                                    ...sensor,
                                    model: action.data.model ?? sensor.model,
                                    status: action.data.status ?? sensor.status,
                                    statusUpdated: action.data.statusUpdated ?? sensor.statusUpdated,
                                } : sensor
                            )),
                        }),
                    },
                }),
            };
        case 'UPDATE_MOTOR_MODULE' :
            // noinspection DuplicatedCode
            return {
                ...state,
                ...(state.data != null && {
                    data: {
                        ...state.data,
                        ...(state.data.motors != null && {
                            motors: state.data.motors.map((motor) => (
                                motor.thingName === action.data.thingName && motor.port === action.data.port ? {
                                    ...motor,
                                    control: action.data.control ?? motor.control,
                                    ...((action.data.status != null && action.data.statusUpdated != null) && {
                                        ...calculateMotorStatus(motor, action.data.status, action.data.statusUpdated)
                                    }),
                                } : motor
                            )),
                        }),
                    },
                }),
            };
        case 'UPDATE_RELAY_MODULE' :
            return {
                ...state,
                ...(state.data != null && {
                    data: {
                        ...state.data,
                        ...(state.data.relays != null && {
                            relays: state.data.relays.map((relay) => (
                                relay.thingName === action.data.thingName && relay.port === action.data.port ? {
                                    ...relay,
                                    control: action.data.control ?? relay.control,
                                    status: action.data.status ?? relay.status,
                                    statusUpdated: action.data.statusUpdated ?? relay.statusUpdated,
                                } : relay
                            )),
                        }),
                    },
                }),
            };
        default:
            throw new Error('Unhandled action');
    }
}

interface DeviceProviderProps {
    thingName: string;
    children?: (props: DeviceState) => React.ReactNode | undefined;
}

function DeviceProvider({thingName, children}: DeviceProviderProps) {
    const {user} = useAuthenticator((context) => [context.user]);
    const {client} = useIotCore();
    const {
        error,
        isLoading,
        mutate,
        data: response,
    } = useSWR<DeviceResponse<DeviceData>>(`/device/${thingName}`, DataFetcher);
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.device,
    });
    const sensorUpdateHandler = useCallback((sensorModules: any) => {
        for (const sensorModule of sensorModules) {
            if (sensorModule.thingName === thingName) {
                dispatch({
                    type: 'UPDATE_SENSOR_MODULE',
                    data: sensorModule,
                });
            }
        }
    }, [thingName]);
    const motorUpdateHandler = useCallback((motorModules: any) => {
        for (const motorModule of motorModules) {
            if (motorModule.thingName === thingName) {
                dispatch({
                    type: 'UPDATE_MOTOR_MODULE',
                    data: motorModule,
                });
            }
        }
    }, [thingName]);
    const relayUpdateHandler = useCallback((relayModules: any) => {
        for (const relayModule of relayModules) {
            if (relayModule.thingName === thingName) {
                dispatch({
                    type: 'UPDATE_RELAY_MODULE',
                    data: relayModule,
                });
            }
        }
    }, [thingName]);
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
            data: response?.device,
        });
    }, [response]);
    useEffect(() => {
        const sensorUpdateSubscription = client.subscribe({
            topics: `user/${user.userId}/device/sensor/update`,
        }).subscribe({
            next: sensorUpdateHandler,
        });
        const motorUpdateSubscription = client.subscribe({
            topics: `user/${user.userId}/device/motor/update`,
        }).subscribe({
            next: motorUpdateHandler,
        });
        const relayUpdateSubscription = client.subscribe({
            topics: `user/${user.userId}/device/relay/update`,
        }).subscribe({
            next: relayUpdateHandler,
        });
        return () => {
            sensorUpdateSubscription.unsubscribe();
            motorUpdateSubscription.unsubscribe();
            relayUpdateSubscription.unsubscribe();
        };
    }, [user, client, thingName, sensorUpdateHandler, motorUpdateHandler, relayUpdateHandler]);
    return (
        <DeviceStateContext.Provider value={state}>
            <DeviceDispatchContext.Provider value={dispatch}>
                {children && children(state)}
            </DeviceDispatchContext.Provider>
        </DeviceStateContext.Provider>
    );
}

function useDevice() {
    const state = useContext(DeviceStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found DeviceDataStateContext');
        }
        throw new Error('Cannot found DeviceDataStateContext');
    }
    return state;
}

function useDeviceDispatch() {
    const dispatch = useContext(DeviceDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found DeviceDataDispatchContext');
        }
        throw new Error('Cannot found DeviceDataDispatchContext');
    }
    return dispatch;
}

export default DeviceProvider;
export {useDevice, useDeviceDispatch};

