import * as admin from "firebase-admin";

import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";

import { Notifier } from "../types";

const serviceAccount = require("../../config/firebase.config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

interface KeyValuePair { [key: string]: any };

const defaultOpts: KeyValuePair = {
  priority: "high",
  timeToLive: 60 * 60 * 24
}

class Firebase implements Notifier {

  config: KeyValuePair;

  constructor(opts = defaultOpts) {
    this.config = opts
  }

  static createPayload(message: string, tag: string): MessagingPayload {
    return {
      notification: {
        tag,
        title: 'Vidalia',
        body: message
      }
    }
  }

  async publish(message: string, recipient: string, tag: string): Promise<boolean> {
    const payload = Firebase.createPayload(message, tag);
    const response = await admin.messaging().sendToDevice(recipient, payload, this.config);
    return response.successCount > 0;
  }
}

export default Firebase;
