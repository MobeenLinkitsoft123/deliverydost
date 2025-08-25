import React from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList,
    useDrawerProgress
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';


function CustomDrawer(props) {
    const progress = useDrawerProgress();

    const translateX = Animated.interpolateNode(progress.value, {
        inputRange: [0, 1],
        outputRange: [-100, 0],
    });
    return (
        <Animated.View style={{ transform: [{ translateX }] }}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </Animated.View>

    )
}

export default CustomDrawer


