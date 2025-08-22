import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@mobile/store/authStore";
import { UserRole } from "@shared/types/feature";

// Import all role-based screens
import BuyerFreeScreen from "@mobile/screens/Roles/Buyer/Free/BuyerFreeScreen";
import BuyerProScreen from "@mobile/screens/Roles/Buyer/Pro/BuyerProScreen";
import SellerFreeScreen from "@mobile/screens/Roles/Seller/Free/SellerFreeScreen";
import SellerProScreen from "@mobile/screens/Roles/Seller/Pro/SellerProScreen";
import AgentFreeScreen from "@mobile/screens/Roles/Agent/Free/AgentFreeScreen";
import AgentProScreen from "@mobile/screens/Roles/Agent/Pro/AgentProScreen";
import InvestorFreeScreen from "@mobile/screens/Roles/Investor/Free/InvestorFreeScreen";
import InvestorProScreen from "@mobile/screens/Roles/Investor/Pro/InvestorProScreen";
import MSMEOwnerFreeScreen from "@mobile/screens/Roles/MSMEOwner/Free/MSMEOwnerFreeScreen";
import MSMEOwnerProScreen from "@mobile/screens/Roles/MSMEOwner/Pro/MSMEOwnerProScreen";
import FounderFreeScreen from "@mobile/screens/Roles/Founder/Free/FounderFreeScreen";
import FounderProScreen from "@mobile/screens/Roles/Founder/Pro/FounderProScreen";
import UserFreeScreen from "@mobile/screens/Roles/User/Free/UserFreeScreen";
import UserProScreen from "@mobile/screens/Roles/User/Pro/UserProScreen";

const Stack = createNativeStackNavigator();

export default function RoleBasedNavigator() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const primaryRole = user.roles[0] as UserRole;
  const isPro = user.isPro;
  
  const getRoleScreens = () => {
    switch (primaryRole) {
      case UserRole.BUYER:
        return (
          <>
            <Stack.Screen 
              name="BuyerDashboard" 
              component={isPro ? BuyerProScreen : BuyerFreeScreen}
              options={{ title: \`Buyer \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      case UserRole.SELLER:
        return (
          <>
            <Stack.Screen 
              name="SellerDashboard" 
              component={isPro ? SellerProScreen : SellerFreeScreen}
              options={{ title: \`Seller \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      case UserRole.AGENT:
        return (
          <>
            <Stack.Screen 
              name="AgentDashboard" 
              component={isPro ? AgentProScreen : AgentFreeScreen}
              options={{ title: \`Agent \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      case UserRole.INVESTOR:
        return (
          <>
            <Stack.Screen 
              name="InvestorDashboard" 
              component={isPro ? InvestorProScreen : InvestorFreeScreen}
              options={{ title: \`Investor \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      case UserRole.MSME_OWNER:
        return (
          <>
            <Stack.Screen 
              name="MSMEOwnerDashboard" 
              component={isPro ? MSMEOwnerProScreen : MSMEOwnerFreeScreen}
              options={{ title: \`MSME Owner \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      case UserRole.FOUNDER:
        return (
          <>
            <Stack.Screen 
              name="FounderDashboard" 
              component={isPro ? FounderProScreen : FounderFreeScreen}
              options={{ title: \`Founder \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
        
      default:
        return (
          <>
            <Stack.Screen 
              name="UserDashboard" 
              component={isPro ? UserProScreen : UserFreeScreen}
              options={{ title: \`User \${isPro ? 'Pro' : 'Free'} Dashboard\` }}
            />
          </>
        );
    }
  };
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {getRoleScreens()}
    </Stack.Navigator>
  );
}