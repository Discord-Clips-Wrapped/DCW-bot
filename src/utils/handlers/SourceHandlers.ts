import { SourceData } from "@db";
import { LogError, LogNew, LogRemoved } from "@utils/logger";
import { Guild } from "discord.js";
import { Document } from "mongoose";

export interface SourceModel extends Document {
  id: string;
  guildId: string;
  checkpoints: Array<string>;
  lastCheckedDate: Date;
}
export async function FetchSource(guild: Guild): Promise<SourceModel | null> {
  const data = await SourceData.findOne({ guildId: guild.id });
  if (!data) return CreateSource(guild);
  return data;
}
export async function FetchCheckpoints(
  guild: Guild
): Promise<{ checkpoints: Array<string> }> {
  const sourceData = (await FetchSource(guild)) as SourceModel;
  return { checkpoints: sourceData.checkpoints };
}

export async function CreateSource(guild: Guild): Promise<SourceModel> {
  const createSource = new SourceData({ guildId: guild.id });
  await createSource
    .save()
    .then(() => LogNew(`SourceData for Guild: ${guild.name} - ${guild.id}`));
  return createSource;
}

export async function UpdateSource(
  guild: Guild,
  data: Partial<SourceModel>
): Promise<SourceModel | null> {
  const sourceData = await FetchSource(guild);
  if (!sourceData) {
    LogError(`SourceData not found for Guild: ${guild.name} - ${guild.id}`);
    return null;
  }

  for (const [key, value] of Object.entries(data)) {
    (sourceData as any)[key] = value;
  }
  return sourceData.save();
}

export async function DeleteSource(guild: Guild): Promise<void> {
  await SourceData.deleteOne({ guildId: guild.id }).then(() =>
    LogRemoved(`SourceData for Guild: ${guild.name} - ${guild.id}`)
  );
}
