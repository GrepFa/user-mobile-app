'use client';

import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import {
  RelayModuleListState, RelayModuleListDispatch, RelayModuleListAction,
} from 'device/module/provider';
import { DataFetcher } from '../../util';
import useSWR from 'swr';
import { RelayModuleListResponse, RelayModulePreview } from 'device/module';
import { useIotCore } from '../../amplify/IotCoreProvider';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import {DEBUG} from '@env';

const RelayModuleListStateContext = createContext<RelayModuleListState | null>(null);
const RelayModuleListDispatchContext = createContext<RelayModuleListDispatch | null>(null);

function reducer(state: RelayModuleListState, action: RelayModuleListAction): RelayModuleListState {
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
        data: state.data?.map((relay) =>
          relay.thingName === action.data.thingName && relay.port === action.data.port ? {
            ...relay,
            control: action.data.control ?? relay.control,
            status: action.data.status ?? relay.status,
            statusUpdated: action.data.statusUpdated ?? relay.statusUpdated,
          } : relay
        ),
      };
    case 'DELETE':
      return {
        ...state,
        data: state.data?.filter((relay) =>
          relay.thingName !== action.data.thingName && relay.port !== action.data.port
        ),
      };
    default:
      throw new Error('Unhandled action');
  }
}

interface RelayModuleListDataProviderProps {
  children?: React.ReactNode | undefined;
}

function RelayModuleListProvider({ children }: RelayModuleListDataProviderProps) {
  const { user } = useAuthenticator((context) => [context.user]);
  const { client } = useIotCore();
  const {
    error,
    isLoading,
    mutate,
    data: response,
  } = useSWR<RelayModuleListResponse<RelayModulePreview>>('/device/relay', DataFetcher);
  // noinspection DuplicatedCode
  const [state, dispatch] = useReducer(reducer, {
    error: error,
    isLoading: isLoading,
    revalidate: mutate,
    data: response?.relays,
  });
  const relayUpdateHandler = useCallback((relayModules: any) => {
    for (const relayModule of relayModules) {
      dispatch({
        type: 'UPDATE',
        data: relayModule,
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
      data: response?.relays,
    });
  }, [response]);
  useEffect(() => {
    const relayUpdateSubscription = client.subscribe({
      topics: `user/${user.userId}/device/relay/update`,
    }).subscribe({
      next: relayUpdateHandler,
    });
    return () => {
      relayUpdateSubscription.unsubscribe();
    };
  }, [user, client, relayUpdateHandler]);
  return (
    <RelayModuleListStateContext.Provider value={state}>
      <RelayModuleListDispatchContext.Provider value={dispatch}>
        {children}
      </RelayModuleListDispatchContext.Provider>
    </RelayModuleListStateContext.Provider>
  );
}

function useRelayModuleList() {
  const state = useContext(RelayModuleListStateContext);
  if (!state) {
    if (DEBUG) {
      console.debug('Cannot found RelayModuleListStateContext');
    }
    throw new Error('Cannot found RelayModuleListStateContext');
  }
  return state;
}

function useRelayModuleListDispatch() {
  const dispatch = useContext(RelayModuleListDispatchContext);
  if (!dispatch) {
    if (DEBUG) {
      console.debug('Cannot found RelayModuleListDispatchContext');
    }
    throw new Error('Cannot found RelayModuleListDispatchContext');
  }
  return dispatch;
}

export default RelayModuleListProvider;
export { useRelayModuleList, useRelayModuleListDispatch };

