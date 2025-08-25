import React from "react";

import {
  Home,
  ResturantOrder,
  OrdersHistory,
  BidHistory,
  Report,
  MultipleBidsScreen,
  Profile,
  ManageNotification
} from "../Screens";
import LegalDocumentsScreen from "../Screens/UserScreen/LegalDocuments/LegalDocumentsScreen";
import Tutorial from "../Screens/UserScreen/Tutorial/Tutorial";
import EarningPayout from "../Screens/UserScreen/EarningScreen/EarningScreen";
import ScheduleAvailability from "../Screens/UserScreen/ScheduleAvailability/ScheduleAvailability";
import ScheduleScreen from "../Screens/UserScreen/ScheduleAvailability/ScheduleScreen";
import AgreementsView from "../Screens/PrivacyScreens/AgreementsView";

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={"Home"}
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"Tutorial"}
        component={Tutorial}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"MultipleBidsScreen"}
        component={MultipleBidsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"ScheduleAvailability"}
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"ScheduleAvailabilityInner"}
        component={ScheduleAvailability}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"ResturantOrder"}
        component={ResturantOrder}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"Profile"}
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"ManageNotification"}
        component={ManageNotification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"OrdersHistory"}
        component={OrdersHistory}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"BidHistory"}
        component={BidHistory}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"Report"}
        component={Report}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"LegalDocumentsScreen"}
        component={LegalDocumentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"EarningPayout"}
        component={EarningPayout}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={"AgreementsView"} component={AgreementsView} options={{ headerShown: false }} />
    </>
  );
}
