import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {FarmConsoleAction, FarmConsoleDispatch, FarmConsoleState} from 'console/provider';
import {FarmPreview} from 'farm';
import {DEBUG} from '@env';
import FarmListProvider, { useFarmList } from './FarmListProvider';
import { View, Button, Text } from 'react-native';

const FarmConsoleStateContext = createContext<FarmConsoleState | null>(null);
const FarmConsoleDispatchContext = createContext<FarmConsoleDispatch | null>(null);

function reducer(state: FarmConsoleState, action: FarmConsoleAction): FarmConsoleState {
    switch (action.type) {
        case 'SET_TARGET_FARM':
            return {
                ...state,
                targetFarm: action.data,
            };
        default:
            throw new Error('Unhandled action');
    }
}

interface ChildrenProps {
    targetFarm: FarmPreview;
    farmList: Array<FarmPreview>;
}

interface FarmConsoleProviderProps {
    children?: ((props: ChildrenProps) => React.ReactNode) | undefined;
}

function FarmConsoleProvider({children}: FarmConsoleProviderProps) {
    return (
        <FarmListProvider>
            <FarmConsoleProviderInside>
                {children}
            </FarmConsoleProviderInside>
        </FarmListProvider>
    );
}

function FarmConsoleProviderInside({children}: FarmConsoleProviderProps) {
    const {data: farmList, isLoading, error, revalidate} = useFarmList();
    const [state, dispatch] = useReducer(reducer, {
        targetFarm: null,
    });
    const {targetFarm} = state;

    useEffect(() => {
        if (targetFarm == null && farmList && farmList.length > 0) {
            dispatch({
                type: 'SET_TARGET_FARM',
                data: farmList[0],
            });
        }
    }, [targetFarm, farmList, dispatch]);
    if (isLoading) {
        return (
            <Text>로딩중...</Text>
        );
    }
    if (error || farmList === undefined) {
        return (
            <View>
                <Text>오류가 발생하였습니다.</Text>
                <Text>오류: {JSON.stringify(error) ?? '알 수 없는 이유로 발생하였습니다.'}</Text>
                <Button onPress={revalidate} title="새로 고침"/>
            </View>
        );
    }
    if (targetFarm == null) {
        return (
            <Text>농장을 생성해주세요.</Text>
        );
    }
    return (
        <FarmConsoleStateContext.Provider value={state}>
            <FarmConsoleDispatchContext.Provider value={dispatch}>
                {children && children({targetFarm, farmList})}
            </FarmConsoleDispatchContext.Provider>
        </FarmConsoleStateContext.Provider>
    );
}

function useFarmConsole() {
    const state = useContext(FarmConsoleStateContext);
    if (!state) {
        if (DEBUG) {
            console.debug('Cannot found FarmControlConsoleDataStateContext');
        }
        throw new Error('Cannot found FarmControlConsoleDataStateContext');
    }
    return state;
}

function useFarmConsoleDispatch() {
    const dispatch = useContext(FarmConsoleDispatchContext);
    if (!dispatch) {
        if (DEBUG) {
            console.debug('Cannot found FarmDispatchContext');
        }
        throw new Error('Cannot found FarmDispatchContext');
    }
    return dispatch;
}

export default FarmConsoleProvider;
export {useFarmConsole, useFarmConsoleDispatch};

