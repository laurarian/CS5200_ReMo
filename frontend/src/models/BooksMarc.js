import mongoose from "mongoose";

// BooksMarc Schema
const FlagsSchema = new mongoose.Schema(
  {
    isDuplicate: { type: Boolean, default: false },
    hasCollision: { type: Boolean, default: false },
    isMissingData: { type: Boolean, default: false },
  },
  { _id: false }
);

const BooksMarcSchema = new mongoose.Schema(
  {
    identifiers: [{ type: String }], // Array of identifiers
    flags: FlagsSchema, // Nested subdocuments
    title: { type: String, required: true },
    publisher: { type: String },
    publicationYear: { type: String },
    language: { type: String },
    edition: { type: String },
    electronicResource: { type: String },
    callNumber: { type: String },
    callNumberPrefix: { type: String },
    recordControlNumber: { type: String },
    recordTimestamp: { type: String },
    fixedData: { type: String },
  },
  { timestamps: true, collection: "books_marc" }
);

export default mongoose.models.BooksMarc ||
  mongoose.model("BooksMarc", BooksMarcSchema);
