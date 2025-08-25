import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { moderateScale, StatusBarHeight } from "../../styles/responsiveSize";

const HeaderAuth = (props) => {

    const navigation = useNavigation()
    const { label, hideback } = props;

    return (
        <View style={styles.conatiner}>


            {hideback != true ?
                <Pressable onPress={() => navigation.goBack()} style={styles.backcontainer}>

                    <Image source={require('../../assets/images/Back.png')} style={styles.backbtn} />

                </Pressable>
                :
                <View />
            }

            <Text style={styles.label} >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    conatiner: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        paddingLeft: 20,
        paddingTop: StatusBarHeight,
        backgroundColor: "#fff",
        elevation: 5,
    },
    backcontainer: {
        height: moderateScale(35),
        width: moderateScale(35),
        justifyContent: "center",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: (25),
        justifyContent: 'center',
        alignItems: "center",
        zIndex: 2
    },
    backbtn: {
        height: '50%',
        width: '50%',
        tintColor: 'red'
    },
    label: {
        alignSelf: "center",
        textAlign: "center",
        flex: 1,
        fontSize: 25,
        fontFamily: "Avenir-Black",
        color: "#e54e5b",
        marginLeft: -30
    }
})

export default HeaderAuth;
