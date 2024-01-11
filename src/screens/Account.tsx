import React from 'react';
import {Button, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAuthenticator} from '@aws-amplify/ui-react-native';

function Account({navigation}: NativeStackScreenProps<any>) {
    const {signOut, user} = useAuthenticator();
    return (
        <>
            <Text>user info : {JSON.stringify(user)}</Text>
            <Button title="signOut" onPress={signOut}/>
        </>
    );
}

export default Account;
