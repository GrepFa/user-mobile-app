import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, ScrollView } from "react-native";
import DeviceWidgetCollection from "../components/device/DeviceWidgetCollection";
import DeviceListProvider from "../libs/provider/DeviceListProvider";

function Device({}: NativeStackScreenProps<any>) {
  return (
    <SafeAreaView>
      <ScrollView>
        <DeviceListProvider>
          <DeviceWidgetCollection/>
        </DeviceListProvider>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Device;
