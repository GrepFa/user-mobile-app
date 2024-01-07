import React, { useCallback, useEffect, useState } from "react";
import { Button, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { FarmListResponse, FarmPreview } from 'farm';
import useSWR from 'swr';
import { DataFetcher } from '../libs/util';
import { useIotCore } from "../libs/amplify/IotCoreProvider";

function Main({ navigation }: NativeStackScreenProps<any>) {
  const {user } = useAuthenticator();
  const {
    error,
    isValidating,
    isLoading,
    mutate,
    data: response,
  } = useSWR<FarmListResponse<FarmPreview>>('/farm', DataFetcher);
  const [data, setData] = useState<Array<any>>([]);
  const {client} = useIotCore();
  useEffect(() => {
    const sensorUpdateSubscription = client.subscribe({
      topics: `user/${user.userId}/device/motor/update`,
    }).subscribe({
      next: (message) => {setData((prevState) => ([...prevState, message]))},
    });
    return () => {
      sensorUpdateSubscription.unsubscribe();
    };
  }, [user, client]);
  return (
    <>
      <Text>isLoading : {JSON.stringify(isLoading)}</Text>
      <Text>isValidating : {JSON.stringify(isValidating)}</Text>
      <Text>error : {JSON.stringify(error)}</Text>
      <Text>response : {JSON.stringify(response)}</Text>
      <Button title="새로 고침" onPress={() => mutate()} />
      <Text>data : {JSON.stringify(data)}</Text>
    </>
  );
}

export default Main;
