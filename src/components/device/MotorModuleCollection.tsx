import { useMotorModuleList } from "../../libs/provider/module/MotorModuleListProvider";
import { Button, Text, View } from "react-native";
import React from "react";
import MotorModuleWidget from "./module/MotorModuleWidget";

function MotorModuleCollection() {
  const {data, isLoading , error, revalidate} = useMotorModuleList();
  
  if (isLoading) {
    return (
      <Text>로딩중...</Text>
    )
  }
  
  if (error || !data) {
    return (
      <View>
        <Text>오류가 발생하였습니다.</Text>
        <Text>오류: {JSON.stringify(error) ?? '알 수 없는 이유로 발생하였습니다.'}</Text>
        <Button onPress={revalidate} title='새로 고침'/>
      </View>
    )
  }
  
  return (
    <>
      {data.map((motor, index) => (
        <MotorModuleWidget key={index} data={motor}/>
      ))}
    </>
  )
}

export default MotorModuleCollection;
