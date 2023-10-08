import mongoose from "mongoose";

export interface SourceModel extends Document {
  id: string;
  guildId: string;
  checkpoints: Array<string>;
  lastCheckedDate: Date;
}

const sourceSchema = new mongoose.Schema({
  id: String,
  guildId: String,
  checkpoints: {
    type: Array,
    default: [],
  },
  lastCheckedDate: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model<SourceModel>("Source", sourceSchema);
