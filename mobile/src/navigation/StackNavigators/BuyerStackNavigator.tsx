import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyerFreeScreen from "@mobile/screens/Roles/Buyer/Free/BuyerFreeScreen";
import BuyerProScreen from "@mobile/screens/Roles/Buyer/Pro/BuyerProScreen";
import { useAuth } from "@mobile/store/authStore";

const Stack = createNativeStackNavigator();

export default function BuyerStackNavigator() {
  const { user } = useAuth();
  const initialRoute = user?.isPro ? "BuyerPro" : "BuyerFree";

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="BuyerFree"
        component={BuyerFreeScreen}
        options={{ title: "Buyer Dashboard" }}
      />
      <Stack.Screen
        name="BuyerPro"
        component={BuyerProScreen}
        options={{ title: "Buyer Pro Dashboard" }}
      />
    </Stack.Navigator>
  );
}