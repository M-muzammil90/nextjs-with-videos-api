import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },

    provider: {
      type: String,
      default: "credentials",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.users ||
  mongoose.model<IUser>("users", UserSchema);

export default User;