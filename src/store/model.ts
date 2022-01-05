import mongoose from "mongoose";

export interface Notification {
  message: string;
  sender: any;
  recipients: string[];
  delivered: boolean;
}

const NotificationSchema = new mongoose.Schema<Notification>({
  message: {
    type: String,
    required: true,
    set: (v: any) => {
      if (typeof v === 'string') return v;

      try {
        const val = JSON.stringify(v);
        return val;
      } catch (e) {
        return v;
      }
    },
    get: (v: any) => {
      try {
        const val = JSON.parse(v);
        return val;
      } catch (e) {
        return v;
      }
    }
  },
  sender: {
    type: String,
    required: true
  },
  recipients: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => !!v.length, // TODO maybe there isn't a need for this validator
      message: 'There must be a recipient'
    }
  },
  delivered: {
    type: Boolean,
    required: true,
    default: false,
  }
})

export default mongoose.model<Notification>('Notification', NotificationSchema);
