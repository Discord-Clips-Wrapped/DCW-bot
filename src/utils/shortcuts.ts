import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import {
  FetchGuild,
  FetchAndGetLang,
  CreateGuild,
  UpdateGuild,
  DeleteGuild,
} from "@handlers/GuildHandlers";
import { LogInfo, LogWarn, LogError, LogNew, LogRemoved } from "@utils/logger";
import {
  FetchSource,
  FetchCheckpoints,
  CreateSource,
  UpdateSource,
  DeleteSource,
} from "@handlers/SourceHandlers";

export function Embed(color = true) {
  const embed = new EmbedBuilder();
  if (color) embed.setColor("#2b2d31");
  return embed;
}

export function Wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function Defer(
  interaction:
    | CommandInteraction
    | ButtonInteraction
    | StringSelectMenuInteraction
) {
  let bool = true;
  await interaction.deferReply({ ephemeral: true }).catch(() => {
    bool = false;
  });
  await Wait(1000);
  return bool;
}

export function Truncate(str: string, max: number) {
  return str.length > max ? str.substring(0, max - 1) + "..." : str;
}

export function CreateButtons(buttons: any[]) {
  let buttonRow = new ActionRowBuilder<ButtonBuilder>();
  for (const button of buttons) {
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style)
        ?.setEmoji(button.emoji)
    );
  }
  return buttonRow;
}

type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY";
export function FormatToDcDate(date: Date, format: DateFormat) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  let DateString =
    format === "DD/MM/YYYY"
      ? `${day}/${month}/${year}`
      : `${month}/${day}/${year}`;
  DateString += ` ${hours}:${minutes}`;
  return DateString;
}

export {
  FetchGuild,
  FetchAndGetLang,
  CreateGuild,
  UpdateGuild,
  DeleteGuild,
  FetchSource,
  FetchCheckpoints,
  CreateSource,
  UpdateSource,
  DeleteSource,
  LogInfo,
  LogWarn,
  LogError,
  LogNew,
  LogRemoved,
};
