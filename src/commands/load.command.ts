import { fetchChannelCheckpoints } from "@utils/fetch-messages";
import LanguageManager from "@utils/language-manager";
import {
  Defer,
  FetchAndGetLang,
  FetchSource,
  UpdateGuild,
  UpdateSource,
} from "@utils/shortcuts";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  TextChannel,
} from "discord.js";

import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class LoadCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "load",
      description: "🤖 Load clips from a channel",
      descriptionLocalizations: {
        fr: "🤖 Charger les clips d'un salon",
      },
      category: "Setup",
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "target",
          nameLocalizations: {
            fr: "cible",
          },
          description: "🎨 Channel to process",
          descriptionLocalizations: {
            fr: "🎨 Channel à traiter",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "force",
          nameLocalizations: {
            fr: "forcer",
          },
          description: "🛑 Force the process",
          descriptionLocalizations: {
            fr: "🛑 Forcer le processus",
          },
          required: false,
        },
      ],
      clientPermissions: ["ViewChannel", "EmbedLinks"],
      userPermissions: ["ManageGuild"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const { options, guild } = interaction;
    await Defer(interaction);

    const { lang } = await FetchAndGetLang(guild!);
    let sourceData = await FetchSource(guild!);
    const sourceChannel = options.get("target")!.channel as TextChannel;
    const force = options.get("force")?.value as boolean;

    const languageManager = new LanguageManager();
    const setup = languageManager.getCommandTranslation(lang).setup;

    if (sourceData?.checkpoints?.length === 0 || force) {
      let approxMsgs = await fetchChannelCheckpoints(
        sourceChannel,
        guild!,
        interaction,
        lang
      );
      approxMsgs = approxMsgs > 1 ? approxMsgs * 100 : -100;

      interaction.editReply({
        content: eval(setup.processed), // Variables used: 'approxMsgs'
      });
      sourceData = await FetchSource(guild!);
    } else {
      interaction.editReply({
        content: eval(setup.alreadyProcessed),
      });
    }

    await UpdateGuild(guild!, {
      sourceChannelId: sourceChannel.id,
    });

    await UpdateSource(guild!, {
      id: sourceChannel.id,
      guildId: guild!.id,
      checkpoints: sourceData?.checkpoints ?? [],
    });
  }
}
