import { Amplify } from 'aws-amplify';
import {I18n} from '@aws-amplify/core';
import { Authenticator } from '@aws-amplify/ui-react-native';
import React from 'react';
import messages from './messages';
import config from '../../amplifyconfiguration.json';

const amplifyConfig = {
  ...config,
  oauth: {
    ...config.oauth,
    domain: "auth.grepfa.com",
  }
};

Amplify.configure(amplifyConfig);

I18n.putVocabularies(messages);
I18n.setLanguage('ko');

function AmplifyConfigurator({ children }: React.PropsWithChildren): React.JSX.Element {
  return (
    <Authenticator.Provider>
      <Authenticator>
        {children}
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default AmplifyConfigurator;
