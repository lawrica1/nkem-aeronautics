import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    service: { type: String, required: true },
    firm: String,
    // "unassigned" until there's an actual firm portal/notification
    // mechanism (AGENTS.md domain rule 7 — firm-side interactions are
    // undesigned) — this honestly reflects that gap rather than faking routing.
    status: { type: String, enum: ["routed", "unassigned"], required: true },
  },
  { timestamps: true },
);

export const ServiceRequest =
  mongoose.models.ServiceRequest ?? mongoose.model("ServiceRequest", serviceRequestSchema);
