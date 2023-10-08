import mongoose from "mongoose";

export interface GuildModel extends Document {
  id: string;
  sourceChannelId: string;
  language: string;
}

const guildSchema = new mongoose.Schema({
  id: String,
  sourceChannelId: String,
  language: {
    type: String,
    default: "en",
  },
});

export default mongoose.model<GuildModel>("Guild", guildSchema);
