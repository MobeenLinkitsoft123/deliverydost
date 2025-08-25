import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from 'react-redux';

import AuthScreen from './AuthScreen';
import MainStack from './MainStack';
import NavigationServices from '../utils/NavigationServices';

const Stack = createNativeStackNavigator();

export default function Routes() {

    const IsuserData = useSelector(state => state?.AuthReducer?.LoginUser);

    return (
        <NavigationContainer ref={(ref) => NavigationServices.setTopLevelNavigator(ref)}>
            <Stack.Navigator>
                {IsuserData ? <>{MainStack(Stack)}</> : <>{AuthScreen(Stack)}</>}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
