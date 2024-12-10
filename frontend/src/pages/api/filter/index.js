import dbConnect from "../../../lib/mongodb";
import models from "../../../models";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { collection, missingFields, page = 1, limit = 10 } = req.query;

        if (!collection || !models[collection]) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid collection name." });
        }

        let missingFieldsArray = [];
        if (missingFields) {
          missingFieldsArray = missingFields
            .split(",")
            .map((field) => field.trim());
        }

        let filter = {};
        if (missingFieldsArray.length > 0) {
          const orConditions = missingFieldsArray.map((field) => ({
            [field]: { $in: [null, ""] },
          }));
          filter = { $or: orConditions };
        }

        const Model = models[collection];

        const total = await Model.countDocuments(filter);

        const parsedLimit = parseInt(limit, 10);
        const calculatedTotalPages = Math.ceil(total / parsedLimit);
        const totalPages = calculatedTotalPages > 0 ? calculatedTotalPages : 1;
        const parsedPage = parseInt(page, 10);
        const currentPage = Math.min(Math.max(parsedPage, 1), totalPages);

        const skip = (currentPage - 1) * parsedLimit;

        const safeSkip = skip >= 0 ? skip : 0;

        const books = await Model.find(filter)
          .sort({ createdAt: -1 })
          .skip(safeSkip)
          .limit(parsedLimit);

        res.status(200).json({
          success: true,
          data: books,
          total,
          totalPages,
          currentPage,
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
