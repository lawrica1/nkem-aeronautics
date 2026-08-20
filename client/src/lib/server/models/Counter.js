import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter ?? mongoose.model("Counter", counterSchema);

// Atomic $inc means concurrent signups can never receive the same sequence
// number — the collision-safety AGENTS.md requires for farmer IDs.
export async function nextFarmerId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "farmerId" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  );

  const year = new Date().getFullYear();
  const padded = String(counter.seq).padStart(6, "0");
  return `NKEM-${year}-${padded}`;
}
