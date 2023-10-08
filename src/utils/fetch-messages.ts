import { UpdateSource } from "@utils/shortcuts";
import LanguageManager from "@utils/language-manager";
import { CommandInteraction, Guild, TextChannel } from "discord.js";

export async function fetchChannelCheckpoints(
  source: TextChannel,
  guild: Guild,
  interaction: CommandInteraction,
  lang: string
) {
  let lastMessageId: string | undefined;
  const messagesIndexes = [];
  const languageManager = new LanguageManager();
  const fetchMessages = languageManager.getUtilsTranslation(lang).fetchMessages;

  while (true) {
    const options = lastMessageId
      ? { limit: 100, before: lastMessageId }
      : { limit: 100 };
    const fetchedMessages = await source.messages.fetch(options);

    if (!fetchedMessages?.size) {
      await UpdateSource(guild, {
        checkpoints: messagesIndexes.filter(
          (id) => id !== undefined
        ) as string[],
      });
      break;
    }

    lastMessageId = fetchedMessages.lastKey();
    messagesIndexes.push(lastMessageId);

    const messagesCount =
      messagesIndexes.length > 1 ? messagesIndexes.length * 100 : -100;
    interaction.editReply({
      content: eval(fetchMessages.pocessing), // Variable used: 'messagesCount'
    });
  }

  return messagesIndexes.length;
}
