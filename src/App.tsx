import React from "react";
import AmplifyConfigurator from "./libs/amplify/Configurator";
import IotCoreProvider from "./libs/amplify/IotCoreProvider";
import LogoAppbar from "./layouts/AppBar";
import BottomNavigator from "./layouts/BottomNavigator";
import {PaperProvider} from "react-native-paper";
import {CombinedDefaultTheme} from "./libs/ui/theme";
import "moment/locale/ko";

function App() {
    return (
        <PaperProvider theme={CombinedDefaultTheme}>
            <AmplifyConfigurator>
                <IotCoreProvider>
                    <LogoAppbar/>
                    <BottomNavigator/>
                </IotCoreProvider>
            </AmplifyConfigurator>
        </PaperProvider>
    );
}

export default App;
