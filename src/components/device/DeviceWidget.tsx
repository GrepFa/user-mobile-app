import { DevicePreview } from "device";
import { Button, Text, View } from "react-native";
import DeviceProvider, { useDevice } from "../../libs/provider/DeviceProvider";
import { Divider } from "react-native-paper";
import SensorModuleWidget from "./module/SensorModuleWidget";
import MotorModuleWidget from "./module/MotorModuleWidget";
import { MotorModulePreview, SensorModulePreview } from "device/module";

interface DeviceWidgetProps {
  data: DevicePreview;
}

function DeviceWidget({ data }: DeviceWidgetProps) {
  return (
    <View
      style={{
        marginBottom: 10
      }}
    >
      <View
        style={{
          marginHorizontal: 15
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 20
          }}
        >
          {data.displayName ?? data.thingName}의 모듈 목록
        </Text>
      </View>
      <DeviceProvider thingName={data.thingName}>
        {() => <DeviceModulePanel />}
      </DeviceProvider>
      <Divider bold={true} />
    </View>
  );
}

function DeviceModulePanel() {
  const { data, isLoading, error, revalidate } = useDevice();
  if (isLoading) {
    return (
      <Text>로딩중...</Text>
    );
  }
  if (error || data == undefined) {
    return (
      <View>
        <Text>오류가 발생하였습니다.</Text>
        <Text>오류: {JSON.stringify(error)}</Text>
        <Button title="새로 고침" onPress={revalidate} />
      </View>
    );
  }
  return (
    <View>
      {data.sensors?.map((module: SensorModulePreview, index: number) => (
        <SensorModuleWidget key={index} data={module} />
      ))}
      {data.motors?.map((module: MotorModulePreview, index: number) => (
        <MotorModuleWidget key={index} data={module} />
      ))}
    </View>
  );
}

export default DeviceWidget;
