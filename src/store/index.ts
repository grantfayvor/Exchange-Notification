import mongoose from "mongoose";

import Notification, { Notification as NotificationType } from "./model";

export { Notification } from "./model";

async function connect () {
  const mongoConn = process.env.MONGODB_CONN as string;
  await mongoose.connect(mongoConn);
}

function saveNotification (notification: NotificationType) {
  return (new Notification(notification)).save();
}

function getUnsentNotifications () {
  return Notification.find({ delivered: false });
}

export default {
  connect,
  saveNotification,
  getUnsentNotifications
}
