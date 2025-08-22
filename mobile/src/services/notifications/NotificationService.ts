import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "@mobile/api/apiClient";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  createdAt: string;
  read: boolean;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      await this.registerToken(token);
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return this.expoPushToken;
  }

  private async registerToken(token: string) {
    try {
      await apiClient.post("/notifications/register-token", {
        token,
        platform: Platform.OS,
      });
      await AsyncStorage.setItem("expo_push_token", token);
    } catch (error) {
      console.error("Failed to register push token:", error);
    }
  }

  async scheduleNotification(title: string, body: string, trigger?: Notifications.NotificationTriggerInput) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { timestamp: Date.now() },
      },
      trigger: trigger || null,
    });
  }

  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getNotifications(): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get<NotificationData[]>("/notifications");
      return response;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  }

  async markAsRead(notificationId: string) {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  async markAllAsRead() {
    try {
      await apiClient.put("/notifications/read-all");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }

  // Business-specific notification methods
  async sendOrderNotification(orderId: string, status: string) {
    const title = "Order Update";
    const body = `Your order #${orderId} is now ${status}`;
    return this.scheduleNotification(title, body);
  }

  async sendPaymentNotification(amount: number, status: "success" | "failed") {
    const title = status === "success" ? "Payment Successful" : "Payment Failed";
    const body = status === "success" 
      ? `Payment of ₹${amount} completed successfully`
      : `Payment of ₹${amount} failed. Please retry.`;
    return this.scheduleNotification(title, body);
  }

  async sendLoanStatusNotification(applicationId: string, status: string) {
    const title = "Loan Application Update";
    const body = `Your loan application #${applicationId} is ${status}`;
    return this.scheduleNotification(title, body);
  }
}

export const notificationService = new NotificationService();