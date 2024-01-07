import { useDeviceList } from "../../libs/provider/DeviceListProvider";
import { Button, Text, View } from "react-native";
import React from "react";
import DeviceWidget from "./DeviceWidget";

function DeviceWidgetCollection() {
    const {
        error,
        isLoading,
        data,
        revalidate
    } = useDeviceList();
    if (isLoading) {
        return (
            <Text>로딩중...</Text>
        )
    }
    if (error || data == undefined) {
        return (
          <View>
            <Text>오류가 발생하였습니다.</Text>
            <Text>오류: {JSON.stringify(error) ?? '알 수 없는 이유로 발생하였습니다.'}</Text>
            <Button onPress={revalidate} title='새로 고침'/>
          </View>
        )
    }
    return (
        <View>
            {data.length == 0 && (
                <Text>등록된 장치가 없습니다.</Text>
            )}
            {data.map((device, index) => (
                <DeviceWidget
                    key={index}
                    data={device}
                />
            ))}
        </View>
    )
}

export default DeviceWidgetCollection;
