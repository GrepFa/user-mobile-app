import React from 'react';
import { Button, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

function Hello({ navigation }: NativeStackScreenProps<any>) {
  const onRoute = () => {
    navigation.navigate('World');
  };
  return (
    <>
      <Button title="Go to World" onPress={onRoute} />
      <Text>This is Hello</Text>
    </>
  );
}

export default Hello;
