import mongoose from "mongoose";

export interface RecipientDevice {
  uid: string;
  token: string;
  active: boolean;
}

const Schema = new mongoose.Schema<RecipientDevice>({
  uid: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
})

export default mongoose.model<RecipientDevice>('RecipientDevice', Schema);
