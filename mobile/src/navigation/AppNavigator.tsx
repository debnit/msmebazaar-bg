import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "@mobile/store/authStore";

// Enhanced screens
import HomeScreen from "@mobile/screens/Home/HomeScreen";
import WelcomeScreen from "@mobile/screens/Onboarding/WelcomeScreen";
import RoleSelectionScreen from "@mobile/screens/Onboarding/RoleSelectionScreen";
import ProUpgradeOfferScreen from "@mobile/screens/ProUpgrade/ProUpgradeOfferScreen";
import LoginScreen from "@mobile/screens/Auth/LoginScreen";
import RegisterScreen from "@mobile/screens/Auth/RegisterScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="ProUpgradeOffer" component={ProUpgradeOfferScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { paddingBottom: 8, height: 60 }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: () => "🏠",
          title: "Home"
        }}
      />
      {/* Add other tabs as needed */}
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Loading screen
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}