import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, StyleSheet, AppState, Alert, } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';
import KeepAwake from '@sayem314/react-native-keep-awake';
import Routes from './src/Navigation/Routes';
import { Environment } from "@env";

import UpdateScreen from './src/Screens/UpdateScreen/UpdateScreen';
import { versionCheck } from './src/Store/Action/AuthFunctions';
import NotificationPermissionModal from './src/Components/AnimtedModal/NotificationPermissionModal';
import AnimatedModal from './src/Components/AnimtedModal/AnimatedModal';
import { IS_USER_ALLOW_NOTIFICATION_PERMISSION, UpdateAppVersion } from './src/Store/Action/AppFunctions';
import colors from './src/styles/colors';
import { useSelector, useDispatch } from 'react-redux';
import { showNotificationModal } from './src/Store/Reducers/AppReducer/AppReducer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BidLogic from './src/Screens/UserScreen/BidLogic/BidLogic';
import { GetNewBidsMain, GetNewBidsMainWithoutLocationPermission } from './src/Store/Action/BidsActionsMain';
import { returnUserDetailData } from './src/utils/helperFunctions';


const App = () => {

  const dispatch = useDispatch();

  const [version, setVersion] = useState(false);
  const [startClose, SetStartClose] = useState(true);
  const [OnChnageAppState, setOnChnageAppState] = useState(true)

  const showNotificationModals = useSelector(state => state?.AppReducer?.showNotificationModal);
  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);
  const LoginUser = useSelector(state => state?.AuthReducer?.LoginUser);

  const userDetailDecrypted = returnUserDetailData(UserDetail);


  useEffect(() => {
    const init = async () => {
      try {
        await RNBootSplash.hide();
        await crashlytics().setCrashlyticsCollectionEnabled(true);
        versionCheck(setVersion);
        IS_USER_ALLOW_NOTIFICATION_PERMISSION();
        await crashlytics().setAttribute('Environment', Environment);
      } catch (error) {
        crashlytics().recordError(error);
      }
    };
    init();
  }, []);

  const handleError = (error) => {
    crashlytics().recordError(error);
  };

  const updateUserVersion = async () => {
    if (userDetailDecrypted?.Id && LoginUser == true) {
      await UpdateAppVersion(userDetailDecrypted.Id, TokenId);
    }
  }

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && LoginUser) {
        updateUserVersion();
      }
      versionCheck(setVersion);
    });
    return () => appStateListener.remove();
  }, []);

  useEffect(() => {
    updateUserVersion();
  }, [userDetailDecrypted?.Id, LoginUser]);

  useEffect(() => {
    const handleChange = AppState.addEventListener("change", (changedState) => {
      setOnChnageAppState(changedState)
    });
    return () => handleChange.remove();
  }, []);

  useEffect(() => {
    if (OnChnageAppState == 'active') {
      setOnChnageAppState(true)
      GetNewBidsMainWithoutLocationPermission(userDetailDecrypted, TokenId, false, null, () => { }, dispatch);
      GetNewBidsMain(userDetailDecrypted, TokenId, true, null, undefined, dispatch);
    }
  }, [OnChnageAppState])

  try {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <KeepAwake />
        <GestureHandlerRootView>
          <Routes />

          {version && (<UpdateScreen />)}
          {!version && showNotificationModals && (
            <AnimatedModal visible={startClose} onClose={() => {
              dispatch(showNotificationModal(false));
              SetStartClose(true);
            }}>
              <NotificationPermissionModal
                OnPress={() => {
                  SetStartClose(false);
                  dispatch(showNotificationModal(false));
                }}
              />
            </AnimatedModal>
          )}
          <BidLogic />
          <Toast position={'bottom'} bottomOffset={20} />
        </GestureHandlerRootView>
      </View>
    );
  } catch (error) {
    console.log(error)
    handleError(error);
    return <Text>ERROR</Text>;
  }
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
