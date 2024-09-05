import { useState, useRef, useEffect } from 'react'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import * as Linking from 'expo-linking'

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
    let token: Notifications.ExpoPushToken | undefined;

    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return undefined;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return undefined;
    }

    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } catch (error) {
      console.error("Error getting push token:", error);
      return undefined;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#EF4852'
      });
    }

    return token;
  }

  function handleNotification(notification: Notifications.Notification) {
    setNotification(notification);
    // You can add any additional handling here if needed
  }

  function handleNotificationResponse(response: Notifications.NotificationResponse) {
    const url = response.notification.request.content.data?.url;
    if (url) {
      Linking.openURL(url);
    }
    // You can add any additional handling here if needed
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Check for initial notification (app was closed)
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (response) {
          handleNotificationResponse(response);
        }
      });

    notificationListener.current = Notifications.addNotificationReceivedListener(handleNotification);

    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    }
  }, [])

  return {
    expoPushToken,
    notification
  }
}