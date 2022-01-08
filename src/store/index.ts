import mongoose from "mongoose";

import Notification, { Notification as NotificationType } from "../models/notification";
import RecipientDevice, { RecipientDevice as RecipientDeviceType } from "../models/recipient.device";

export * from "../models/notification";

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

function saveRecipientDevice (recipient: RecipientDeviceType) {
  return (new RecipientDevice(recipient)).save();
}

async function getRecipientsDevices(recipients: string[]): Promise<string[]> {
  const res = await RecipientDevice.aggregate([
    {
      $match: {
        uid: { $in: recipients },
        active: true
      }
    },
    {
      $group: {
        _id: null,
        tokens: {
          $push: '$token'
        }
      }
    }
  ]);
  return res[0].tokens;
}

export default {
  connect,
  saveNotification,
  getUnsentNotifications,
  setNotificationStatus,
  saveRecipientDevice,
  getRecipientsDevices
}
