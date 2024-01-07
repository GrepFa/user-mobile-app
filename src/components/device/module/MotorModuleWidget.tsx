import { ModuleControlMode, MotorModulePreview } from "device/module";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import ApiRequest from "../../../libs/util";
import { Text, View } from "react-native";
import { Card, ToggleButton } from "react-native-paper";

const ControlModeItems: Array<{
  label: string,
  value: ModuleControlMode
}> = [
  {
    label: "수동",
    value: "LOCAL"
  },
  {
    label: "원격",
    value: "REMOTE"
  }
];

interface TempModule {
  status: number;
  level: number;
}

interface RelayModuleWidgetProps {
  data: MotorModulePreview;
}

function MotorModuleWidget({ data }: RelayModuleWidgetProps) {
  const {
    thingName, port,
    control,
    status, statusUpdated,
    level, maxLevel
  } = data;
  const [temp, setTemp] = useState<TempModule>(data);
  const { level: tempLevel, status: tempStatus } = temp;
  
  const onChangeButton = async (value: number) => {
    const response = await ApiRequest({
      method: "POST",
      url: `/device/${thingName}/motor/${port}`,
      body: JSON.stringify({
        status: value
      })
    });
    if (response.ok) {
      setTemp((prevState) => ({
        ...prevState,
        status: value
      }));
    }
  };
  
  // noinspection DuplicatedCode
  useEffect(() => {
    setTemp((prevState) => ({
      ...prevState,
      status: status
    }));
  }, [status]);
  
  // noinspection DuplicatedCode
  useEffect(() => {
    setTemp((prevState) => ({
      ...prevState,
      level: level
    }));
  }, [level]);
  
  // noinspection DuplicatedCode
  useEffect(() => {
    const update = setInterval(() => {
      setTemp((prevState) => ({
        ...prevState,
        level: Math.max(0, Math.min(maxLevel, prevState.level + status))
      }));
    }, 1000);
    return () => {
      clearInterval(update);
    };
  }, [status, maxLevel]);
  
  return (
    <Card
      style={{
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10
      }}
    >
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{
          color: "black"
        }}>모듈 주소:</Text>
        <Text style={{
          color: "black"
        }}>{port}</Text>
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{
          color: "black"
        }}>모듈 모델:</Text>
        <Text style={{
          color: "black"
        }}>모터 드라이버</Text>
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{
          display: "flex",
          color: "black",
          marginVertical: 12
        }}>제어 상태:</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          <MotorModuleControlPanel
            disabled={false}
            state={tempStatus}
            onChangeButton={onChangeButton}
          />
        </View>
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{
          color: "black"
        }}>마지막 제어:</Text>
        <Text style={{
          color: "black"
        }}>
          {moment.unix(statusUpdated).fromNow()}
        </Text>
      </View>
    </Card>
  );
}

const MotorButtonItems: Array<{
  label: string;
  value: string;
  icon: string;
}> = [
  {
    label: "닫힘",
    value: "-1",
    icon: "chevron-double-down"
  },
  {
    label: "정지",
    value: "0",
    icon: "stop"
  },
  {
    label: "열림",
    value: "1",
    icon: "chevron-double-up"
  }
];

interface MotorControlButtonPanelProps {
  disabled: boolean;
  state: number;
  onChangeButton: (value: number) => void;
}

function MotorModuleControlPanel({ disabled, state, onChangeButton }: MotorControlButtonPanelProps) {
  return (
    <ToggleButton.Group
      value={state.toString()}
      onValueChange={(value) => onChangeButton(parseInt(value))}
    >
      {MotorButtonItems.map((button, index) => (
        <ToggleButton key={index} disabled={disabled} icon={button.icon} value={button.value.toString()} />
      ))}
    </ToggleButton.Group>
  );
}

interface ModuleLevelPanelProps {
  level: number;
  maxLevel: number;
}

function MotorModuleLevelPanel({ level, maxLevel }: ModuleLevelPanelProps) {
  if (maxLevel == 0) return;
  return (
    <Text
      style={{
        marginEnd: 1,
        marginHorizontal: "auto"
      }}
    >
      현재: ${Math.round((level / maxLevel) * 100)} %
    </Text>
  );
}

export default MotorModuleWidget;
export { MotorModuleControlPanel, MotorModuleLevelPanel };

