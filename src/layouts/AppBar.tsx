import {Appbar} from "react-native-paper";
import React from "react";
import {Image, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    logo: {
        width: 70,
        height: 51,
    },
});

interface LogoAppbarProps {
}

function LogoAppbar({}: LogoAppbarProps) {
    const logo = (
        <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
        />
    )
    return (
        <Appbar.Header elevated={true}>
            <Appbar.Content title={logo}/>
        </Appbar.Header>
    );
}

export default LogoAppbar;
