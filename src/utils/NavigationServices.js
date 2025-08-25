import { CommonActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  try {
    _navigator.dispatch(
      CommonActions.navigate({
        name: routeName,
        params,
      })
    );
  } catch (error) {
    console.log('error', error);
  }

}

function goBack() {
  try {
    _navigator.dispatch(CommonActions.goBack());
  } catch (error) {
    console.log('error', error);
  }

}

function getCurrentRoute() {
  return _navigator?.getCurrentRoute?.()?.name;
}
function popToTop() {
  // _navigator.dispatch(
  //   CommonActions.reset({
  //     index: 0,
  //     routes: [{ name: getCurrentRoute() }],
  //   })
  // );
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  getCurrentRoute,
  popToTop
};