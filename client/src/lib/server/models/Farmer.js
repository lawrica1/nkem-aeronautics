import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    hash: String,
    channel: { type: String, enum: ["sms", "email"] },
    contact: String,
    expiresAt: Date,
  },
  { _id: false },
);

const farmerSchema = new mongoose.Schema(
  {
    sector: { type: String, enum: ["agricultural", "wildlife", "realestate"], required: true },
    surname: { type: String, required: true },
    name: { type: String, required: true },
    sex: String,
    telephone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    crop: String,
    firm: String,
    otherFirm: String,
    wildlifeOrg: String,
    wildlifeRole: String,
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    identificationNumber: String,
    otp: otpSchema,
  },
  { timestamps: true },
);

// Only one *verified* account may hold a given email; unverified pending
// signups are allowed to collide so a farmer can retry/resend without
// tripping a duplicate-key error.
farmerSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isVerified: true } },
);

export const Farmer = mongoose.models.Farmer ?? mongoose.model("Farmer", farmerSchema);
