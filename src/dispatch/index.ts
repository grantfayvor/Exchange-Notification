import Firebase from "../firebase";
import store, { Notification, NotificationTypes } from "../store";

export default (function dispatcher() {
  const firebase = new Firebase();

  async function dispatch(notification: Notification) {
    switch (notification.type) {
      case NotificationTypes.PUSH:
        const recipients = await store.getRecipientsDevices(notification.recipients);
        const saved = await store.saveNotification({ ...notification, recipients });
        const delivered = await firebase.publishMultiple(notification.message, recipients, notification.tag);
        await store.setNotificationStatus(saved._id, delivered);
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
