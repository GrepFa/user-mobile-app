import {SensorModuleModel, SensorModulePreview} from "device/module";
import React from "react";
import {Text} from "react-native";
import {Card} from "react-native-paper";

const Labels = [
    "실내 온도 센서",
    "실내 습도 센서",
    "실내 Co2 센서"
]

interface SensorModuleWidgetProps {
    index: number,
    data: SensorModulePreview;
}

function SensorModuleWidget({index, data}: SensorModuleWidgetProps) {
    const {port, model, status, statusUpdated,} = data;
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
                        fontSize: 20,
                    }}
                >
                    {Labels[index] ?? "알 수 없는 채널"}
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                    }}
                >
                    {status} {getSensorModuleUnit(model)}
                </Text>
            </Card.Content>
        </Card>
    );
}

function getSensorModuleUnit(model: SensorModuleModel): string {
    if (model == "TEMPERATURE_SENSOR" || model == "GROUND_TEMPERATURE_SENSOR") return "℃";
    if (model == "HUMIDITY_SENSOR") return "%";
    if (model == "CO2_SENSOR") return "ppm";
    if (model == "SOLAR_RADIATION_SENSOR") return "W/m<sup>2</sup>";
    if (model == "WIND_DIRECTION_SENSOR") return "°";
    if (model == "WIND_SPEED_SENSOR") return "m/s";
    if (model == "RAINFALL_SENSOR") return "ON/OFF";
    if (model == "PHOTON_SENSOR") return "umol/m<sup>2</sup>/s";
    if (model == "GROUND_MOISTURE_SENSOR") return "% vol";
    if (model == "GROUND_MOISTURE_TENSION_SENSOR") return "kPa";
    if (model == "EC_SENSOR") return "dS/m";
    if (model == "PH_SENSOR") return "pH";
    return "";
}

function getSensorModuleModel(model: SensorModuleModel): string {
    if (model == "TEMPERATURE_SENSOR") return "온도 센서";
    if (model == "HUMIDITY_SENSOR") return "습도 센서";
    if (model == "CO2_SENSOR") return "C0<sub>2</sub> 센서";
    if (model == "SOLAR_RADIATION_SENSOR") return "일사 센서";
    if (model == "WIND_DIRECTION_SENSOR") return "풍향 센서";
    if (model == "WIND_SPEED_SENSOR") return "풍속 센서";
    if (model == "RAINFALL_SENSOR") return "강우 센서";
    if (model == "PHOTON_SENSOR") return "광양자 센서";
    if (model == "GROUND_MOISTURE_SENSOR") return "토양 함수율 센서";
    if (model == "GROUND_MOISTURE_TENSION_SENSOR") return "토양 수분 장력 센서";
    if (model == "EC_SENSOR") return "EC 센서";
    if (model == "PH_SENSOR") return "pH 센서";
    if (model == "GROUND_TEMPERATURE_SENSOR") return "지온 센서";
    return "";
}


export default SensorModuleWidget;
export {getSensorModuleUnit, getSensorModuleModel};
