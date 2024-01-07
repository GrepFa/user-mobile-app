import {FarmAutoControlAction, FarmAutoControlDispatch, FarmAutoControlState} from 'farm/provider';
import React, {createContext, useContext, useEffect, useReducer} from 'react';
import useSWR from 'swr';
import {AutoControlListResponse, AutoControlPreview} from 'farm/auto/control';
import { Button, Text, View } from 'react-native';
import { DataFetcher } from '../util';
import {DEBUG} from '@env';

const FarmAutoControlStateContext = createContext<FarmAutoControlState | null>(null);
const FarmAutoControlDispatchContext = createContext<FarmAutoControlDispatch | null>(null);

function reducer(state: FarmAutoControlState, action: FarmAutoControlAction): FarmAutoControlState {
    switch (action.type) {
        case 'INIT_IS_LOADING':
            return {
                ...state,
                isLoading: action.isLoading
            }
        case 'INIT_ERROR':
            return {
                ...state,
                error: action.error
            }
        case 'INIT_DATA':
            return {
                ...state,
                data: action.data
            }
        case 'UPDATE':
            return {
                ...state,
                data: state.data?.map((autoControl) => (
                    autoControl.id == action.data.id ? {
                        ...action.data
                    } : autoControl
                ))
            }
        case 'DELETE':
            return {
                ...state,
                data: state.data?.filter((autoControl) => autoControl.id != action.data.id)
            }
        default:
            throw new Error('Unhandled action');
    }
}

interface ChildrenProps {
    autoControls: Array<AutoControlPreview>;
}

interface FarmAutoControlProviderProps {
    farmId: string;
    children?: (props: ChildrenProps) => React.ReactNode | undefined;
}

function FarmAutoControlProvider({farmId, children}: FarmAutoControlProviderProps) {
    const {
        error,
        isLoading,
        mutate,
        data: response
    } = useSWR<AutoControlListResponse<AutoControlPreview>>(`/farm/${farmId}/auto/control`, DataFetcher);
    const [state, dispatch] = useReducer(reducer, {
        error: error,
        isLoading: isLoading,
        revalidate: mutate,
        data: response?.autoControls
    });
    
    useEffect(() => {
        dispatch({
            type: 'INIT_ERROR',
            error: error
        })
    }, [error]);
    
    useEffect(() => {
        dispatch({
            type: 'INIT_IS_LOADING',
            isLoading: isLoading
        })
    }, [isLoading]);
    
    useEffect(() => {
        dispatch({
            type: 'INIT_DATA',
            data: response?.autoControls,
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
              <Button onPress={() => mutate()} title='새로 고침'/>
          </View>
        )
    }
    
    return (
        <FarmAutoControlStateContext.Provider value={state}>
            <FarmAutoControlDispatchContext.Provider value={dispatch}>
                {children && children({autoControls: state.data})}
            </FarmAutoControlDispatchContext.Provider>
        </FarmAutoControlStateContext.Provider>
    )
}

function useFarmAutoControl() {
    const state = useContext(FarmAutoControlStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found FarmDataStateContext');
        }
        throw new Error('Cannot found FarmDataStateContext');
    }
    return state;
}

function useFarmAutoControlDispatch() {
    const dispatch = useContext(FarmAutoControlDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found FarmDataDispatchContext');
        }
        throw new Error('Cannot found FarmDataDispatchContext');
    }
    return dispatch;
}

export default FarmAutoControlProvider;
export {useFarmAutoControl, useFarmAutoControlDispatch};

