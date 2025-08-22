import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SellerFreeScreen from "@mobile/screens/Roles/Seller/Free/SellerFreeScreen";
import SellerProScreen from "@mobile/screens/Roles/Seller/Pro/SellerProScreen";
import { useAuth } from "@mobile/store/authStore";

const Stack = createNativeStackNavigator();

export default function SellerStackNavigator() {
  const { user } = useAuth();
  const initialRoute = user?.isPro ? "SellerPro" : "SellerFree";

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="SellerFree"
        component={SellerFreeScreen}
        options={{ title: "Seller Dashboard" }}
      />
      <Stack.Screen
        name="SellerPro"
        component={SellerProScreen}
        options={{ title: "Seller Pro Dashboard" }}
      />
    </Stack.Navigator>
  );
}