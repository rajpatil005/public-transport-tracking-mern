import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: true,
      index: true,
    },

    routeName: String,

    startPoint: String,

    endPoint: String,

    stops: [
      {
        name: String,
        lat: Number,
        lng: Number,
      },
    ],

    path: [
      {
        lat: Number,
        lng: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Route", routeSchema);
