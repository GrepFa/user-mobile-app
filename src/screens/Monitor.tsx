import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, ScrollView } from "react-native";
import SensorModuleListProvider from "../libs/provider/module/SensorModuleListProvider";
import SensorModuleWidget from "../components/new/SensorModuleWidget";

function Device({}: NativeStackScreenProps<any>) {
  return (
    <SafeAreaView>
      <ScrollView>
          <SensorModuleListProvider>
              {({sensors}) => sensors.map((sensor, index) => (
                    <SensorModuleWidget key={index} index={index} data={sensor}  />
              ))}
          </SensorModuleListProvider>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Device;
