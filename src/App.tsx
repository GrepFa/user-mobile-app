import React from "react";
import AmplifyConfigurator from "./libs/amplify/Configurator";
import IotCoreProvider from "./libs/amplify/IotCoreProvider";
import NavigationProvider from "./libs/navigation/Provider";
import { PaperProvider } from "react-native-paper";
import { CombinedDefaultTheme } from "./libs/ui/theme";
import "moment/locale/ko";

function App() {
  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <AmplifyConfigurator>
        <IotCoreProvider>
          <NavigationProvider />
        </IotCoreProvider>
      </AmplifyConfigurator>
    </PaperProvider>
  );
}

export default App;
