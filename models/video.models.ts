import mongoose, { Schema } from "mongoose";

export const VIDEODIMATION = {
  height: 1080,
  width: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: String;
  discription: String;
  thumnail: String;
  videos: String;
  constrol?: boolean;
  transformations?: {
    height: Number;
    width: Number;
    quantity?: Number;
  };
}

const videosSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    thumnail: {
      type: String,
      required: true,
    },
    videos: {
      type: String,
      required: true,
    },
    constrol: {
      type: Boolean,
      default: true,
    },
    transformations: {
      height: {
        type: Number,
        default: VIDEODIMATION.height,
      },
      width: {
        type: Number,
        default: VIDEODIMATION.width,
      },
      quantity:{type:Number,min:1,max:100}
    },
  },
  { timestamps: true },
);

const Videos = mongoose.models?.videos || mongoose.model("videos",videosSchema)
export default Videos