import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, ScrollView } from "react-native";
import MotorModuleListProvider from "../libs/provider/module/MotorModuleListProvider";
import MotorModuleWidget from "../components/new/MotorModuleWidget";

function Device({}: NativeStackScreenProps<any>) {
  return (
    <SafeAreaView>
      <ScrollView>
          <MotorModuleListProvider>
              {({motors}) => motors.map((motor, index) => (
                    <MotorModuleWidget key={index} index={index} data={motor}  />
              ))}
          </MotorModuleListProvider>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Device;
