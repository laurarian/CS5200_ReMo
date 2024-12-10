import mongoose from "mongoose";

// MarcIssuesLogSchema
const MarcIssuesLogSchema = new mongoose.Schema(
  {
    record: [{ type: String }], // Record original MARC data
    issues: [{ type: String }], // Question array
  },
  { timestamps: true, collection: "marcIssuesLog" }
);

export default mongoose.models.MarcIssuesLog ||
  mongoose.model("MarcIssuesLog", MarcIssuesLogSchema);
