import {CONNECTION_STATE_CHANGE, ConnectionState, PubSub} from '@aws-amplify/pubsub';
import {Hub} from '@aws-amplify/core';
import ApiRequest from '../util';
import config from '../../amplifyconfiguration.json';
import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {IotCoreAction, IotCoreDispatch, IotCoreState} from 'util/mqtt';
import {AWS_IOT_CORE_ENDPOINT} from '@env';

const IotCoreEndpoint = AWS_IOT_CORE_ENDPOINT;
const Region = config.aws_project_region;

const IotCoreStateContext = createContext<IotCoreState | null>(null);
const IotCoreDispatchContext = createContext<IotCoreDispatch | null>(null);

function reducer(state: IotCoreState, _: IotCoreAction): IotCoreState {
    return {
        ...state,
    };
}

interface IotCoreProviderProps {
    children: React.ReactNode;
}

function IotCoreProvider({children}: IotCoreProviderProps) {
    const [state, dispatch] = useReducer(reducer, {
        client: new PubSub({
            region: Region,
            endpoint: `wss://${IotCoreEndpoint}/mqtt`,
        }),
    });
    useEffect(() => {
        const removeHub = Hub.listen('pubsub',  async (data) => {
            const {payload} = data;
            if (payload.event === CONNECTION_STATE_CHANGE) {
                // @ts-ignore
                const connectionState: ConnectionState = payload.data.connectionState as ConnectionState;
                if (connectionState === ConnectionState.ConnectionDisrupted) {
                    const response = await ApiRequest({
                        url: '/user/policy/update',
                    });
                    if (!response.ok) {
                        console.error('AWS IoT Core user policy update fail.');
                    }
                }
            }
        });
        return () => {
            removeHub();
        };
    }, []);
    return (
        <IotCoreStateContext.Provider value={state}>
            <IotCoreDispatchContext.Provider value={dispatch}>
                {children}
            </IotCoreDispatchContext.Provider>
        </IotCoreStateContext.Provider>
    );
}

function useIotCore() {
    const state = useContext(IotCoreStateContext);
    if (!state) {
        throw new Error('cannot found IotCoreStateContext');
    }
    return state;
}

export default IotCoreProvider;
export {useIotCore};
