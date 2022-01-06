import Firebase from "../firebase";
import store, { Notification, NotificationTypes } from "../store";

export default (function dispatcher() {
  const firebase = new Firebase();

  async function dispatch(notification: Notification) {
    switch (notification.type) {
      case NotificationTypes.PUSH:
        const saved = await store.saveNotification(notification);
        const tasks = notification.recipients.map(
          recipient => firebase.publish(notification.message, recipient, notification.tag)
        );
        await Promise.all(tasks);
        await store.setNotificationStatus(saved._id, true);
        break;
      case NotificationTypes.SMS:
      default:
        console.error('Nothing to do here...');
    }
  }

  return {
    dispatch
  };
})();
