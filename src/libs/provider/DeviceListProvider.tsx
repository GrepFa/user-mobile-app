'use client';

import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {
    DeviceListAction,
    DeviceListDispatch,
    DeviceListState,
} from 'device/provider';
import {DeviceListResponse, DevicePreview} from 'device';
import useSWR from 'swr';
import {DEBUG} from '@env';
import { DataFetcher } from '../util';

const DeviceListStateContext = createContext<DeviceListState | null>(null);
const DeviceListDispatchContext = createContext<DeviceListDispatch | null>(null);

function reducer(state: DeviceListState, action: DeviceListAction): DeviceListState {
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
            return {
                ...state,
                data: state.data?.map((device) =>
                    device.thingName !== action.data.thingName ? device : {
                        ...action.data,
                    }
                ),
            };
        case 'DELETE':
            return {
                ...state,
                data: state.data?.filter((device) =>
                    device.thingName !== action.data.thingName
                ),
            };
        default:
            throw new Error('Unhandled action');
    }
}

interface DeviceListProviderProps {
    children?: React.ReactNode | undefined;
}

function DeviceListProvider({children}: DeviceListProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response,
    } = useSWR<DeviceListResponse<DevicePreview>>('/device', DataFetcher);
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.devices,
    });
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
            data: response?.devices,
        });
    }, [response]);
    return (
        <DeviceListStateContext.Provider value={state}>
            <DeviceListDispatchContext.Provider value={dispatch}>
                {children}
            </DeviceListDispatchContext.Provider>
        </DeviceListStateContext.Provider>
    );
}

function useDeviceList() {
    const state = useContext(DeviceListStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found DeviceListStateContext');
        }
        throw new Error('Cannot found DeviceListStateContext');
    }
    return state;
}

function useDeviceListDispatch() {
    const dispatch = useContext(DeviceListDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found DeviceListDispatchContext');
        }
        throw new Error('Cannot found DeviceListDispatchContext');
    }
    return dispatch;
}

export default DeviceListProvider;
export {useDeviceList, useDeviceListDispatch};

