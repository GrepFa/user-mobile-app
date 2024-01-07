import React from 'react';
import { Button, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

function World({ navigation }: NativeStackScreenProps<any>) {
  const onRoute = () => {
    navigation.navigate('Hello');
  };
  return (
    <>
      <Button title="Go to Hello" onPress={onRoute} />
      <Text>This is world</Text>
    </>
  );
}

export default World;
