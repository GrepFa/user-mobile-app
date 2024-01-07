import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {
    FarmListAction,
    FarmListDispatch,
    FarmListState,
} from 'farm/provider';
import {FarmListResponse, FarmPreview} from 'farm';
import useSWR from 'swr';
import {DEBUG} from '@env';
import { DataFetcher } from '../util';

const FarmListStateContext = createContext<FarmListState | null>(null);
const FarmListDispatchContext = createContext<FarmListDispatch | null>(null);

function reducer(state: FarmListState, action: FarmListAction): FarmListState {
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
                data: state.data?.map((farm) =>
                    farm.id !== action.data.id ? farm : {
                        ...action.data,
                    }
                ),
            };
        case 'DELETE':
            return {
                ...state,
                data: state.data?.filter((farm) =>
                    farm.id !== action.data.id
                ),
            };
        default:
            throw new Error('Unhandled action');
    }
}

interface FarmListProviderProps {
    children?: React.ReactNode | undefined;
}

function FarmListProvider({children}: FarmListProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response,
    } = useSWR<FarmListResponse<FarmPreview>>('/farm', DataFetcher);
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.farms,
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
            data: response?.farms,
        });
    }, [response]);
    return (
        <FarmListStateContext.Provider value={state}>
            <FarmListDispatchContext.Provider value={dispatch}>
                {children}
            </FarmListDispatchContext.Provider>
        </FarmListStateContext.Provider>
    );
}

function useFarmList() {
    const state = useContext(FarmListStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found farmListStateContext');
        }
        throw new Error('Cannot found farmListStateContext');
    }
    return state;
}

function useFarmListDispatch() {
    const dispatch = useContext(FarmListDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found farmListDispatchContext');
        }
        throw new Error('Cannot found farmListDispatchContext');
    }
    return dispatch;
}

export default FarmListProvider;
export {useFarmList, useFarmListDispatch};

