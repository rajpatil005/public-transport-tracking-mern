import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["PDF", "Excel"],
    default: "PDF"
  },
  size: {
    type: String
  },
  status: {
    type: String,
    enum: ["ready", "generating", "failed"],
    default: "ready"
  },
  reportType: {
    type: String,
    enum: ["daily", "weekly", "monthly", "quarterly", "custom"],
    default: "daily"
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  downloadUrl: {
    type: String
  }
}, {
  timestamps: true
});

const Report = mongoose.model("Report", reportSchema);
export default Report;