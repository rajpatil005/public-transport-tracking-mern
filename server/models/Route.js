import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, required: true },

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

const Route = mongoose.model("Route", routeSchema);

export default Route;
