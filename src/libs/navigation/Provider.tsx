import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Main from "../../screens/Main";
import Account from "../../screens/Account";
import Device from "../../screens/Device";

const Tab = createMaterialBottomTabNavigator();

interface TabItem {
  name: string;
  label: string;
  component: React.JSX.Element | any;
  icon: string;
}

const TabItems: Array<TabItem> = [
  {
    name: 'main',
    label: "메인",
    component: Main,
    icon: "home"
  },
  {
    name: 'device-develop',
    label: "개발자",
    component: Device,
    icon: "tools"
  },
  {
    name: 'account',
    label: '내 계정',
    component: Account,
    icon: "account"
  }
]

function NavigationProvider() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {TabItems.map(({ name, label,  icon, component }, index) => (
          <Tab.Screen
            key={index}
            name={name}
            component={component}
            options={{
              tabBarLabel: label,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name={icon} color={color} size={26} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default NavigationProvider;
