import mongoose from "mongoose";

import Notification, { Notification as NotificationType } from "./model";

export * from "./model";

async function connect() {
  const mongoConn = process.env.MONGODB_CONN as string;
  await mongoose.connect(mongoConn);
}

function saveNotification(notification: NotificationType) {
  return (new Notification(notification)).save();
}

async function setNotificationStatus(notificationId: mongoose.Types.ObjectId, delivered: boolean) {
  const response = await Notification.updateOne({ _id: notificationId }, { $set: { delivered } });
  return response.modifiedCount > 0
}

function getUnsentNotifications() {
  return Notification.find({ delivered: false });
}

export default {
  connect,
  saveNotification,
  getUnsentNotifications,
  setNotificationStatus
}
