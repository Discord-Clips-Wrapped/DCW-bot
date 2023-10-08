import { GuildData } from "@db";
import { LogError, LogNew, LogRemoved } from "@utils/logger";
import { Guild } from "discord.js";
import { Document } from "mongoose";

export interface GuildModel extends Document {
  id: string;
  sourceChannelId: string;
  language: string;
}

export async function FetchGuild(guild: Guild): Promise<GuildModel | null> {
  const data = await GuildData.findOne({ id: guild.id });
  if (!data) return CreateGuild(guild);
  return data;
}

export async function FetchAndGetLang(
  guild: Guild
): Promise<{ guildData: GuildModel; lang: string }> {
  const guildData = (await FetchGuild(guild)) as GuildModel;
  return { guildData, lang: guildData.language };
}

export async function CreateGuild(guild: Guild): Promise<GuildModel> {
  const createGuild = new GuildData({ id: guild.id });
  await createGuild
    .save()
    .then(() =>
      LogNew(
        `GuildData: ${guild.name} - ${guild.id} - ${guild.members.cache.size} users`
      )
    );
  return createGuild;
}

export async function UpdateGuild(
  guild: Guild,
  data: Partial<GuildModel>
): Promise<GuildModel | null> {
  const guildData = await FetchGuild(guild);
  if (!guildData) {
    LogError(`GuildData not found for Guild: ${guild.name} - ${guild.id}`);
    return null;
  }

  for (const [key, value] of Object.entries(data)) {
    (guildData as any)[key] = value;
  }
  return guildData.save();
}

export async function DeleteGuild(guild: Guild): Promise<void> {
  await GuildData.deleteOne({ id: guild.id }).then(() =>
    LogRemoved(`GuildData: ${guild.name} - ${guild.id}`)
  );
}
