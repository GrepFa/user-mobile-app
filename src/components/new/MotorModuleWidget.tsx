import {MotorModulePreview} from "device/module";
import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {Card, ToggleButton} from "react-native-paper";
import ApiRequest from "../../libs/util";

const Labels = [
    "좌측 1중 측창 모터",
    "우측 1중 측창 모터",
    "좌측 2중 측창 모터",
    "우측 2중 측창 모터",
]

interface TempModule {
    status: number;
    level: number;
}

interface RelayModuleWidgetProps {
    index: number;
    data: MotorModulePreview;
}

function MotorModuleWidget({index, data}: RelayModuleWidgetProps) {
    const {
        thingName, port,
        status, statusUpdated,
    } = data;
    const [temp, setTemp] = useState<TempModule>(data);
    const {level: tempLevel, status: tempStatus} = temp;
    const onChangeButton = async (value: number) => {
        const response = await ApiRequest({
            method: "POST",
            url: `/device/${thingName}/motor/${port}`,
            body: JSON.stringify({
                status: value,
            }),
        });
        if (response.ok) {
            setTemp((prevState) => ({
                ...prevState,
                status: value,
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
    return (
        <Card
            style={{
                marginHorizontal: 20,
                marginVertical: 10,
                padding: 5,
            }}
        >
            <Card.Content
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Text
                    style={{
                        marginVertical: "auto",
                        fontSize: 20,
                        textAlignVertical: "center"
                    }}
                >
                    {Labels[index] ?? "알 수 없는 채널"}
                </Text>
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
            </Card.Content>
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

function MotorModuleControlPanel({disabled, state, onChangeButton}: MotorControlButtonPanelProps) {
    return (
        <ToggleButton.Group
            value={state.toString()}
            onValueChange={(value) => onChangeButton(parseInt(value))}
        >
            {MotorButtonItems.map((button, index) => (
                <ToggleButton key={index} disabled={disabled} icon={button.icon} value={button.value.toString()}/>
            ))}
        </ToggleButton.Group>
    );
}

export default MotorModuleWidget;
export {MotorModuleControlPanel};

