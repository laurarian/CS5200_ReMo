import mongoose from "mongoose";

// CsvIssuesLogSchema
const CsvIssuesLogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    materialType: { type: String, required: true },
    publisher: { type: String },
    issues: [{ type: String }], // issue array
  },
  { timestamps: true, collection: "csvIssuesLog" }
);

export default mongoose.models.CsvIssuesLog ||
  mongoose.model("CsvIssuesLog", CsvIssuesLogSchema);
