export const DiscordConstant = {
  guilds: {
    defaultGuild: '1081069976556945459',
  },
  channels: {
    supportChannelCategory: '1081391481731960883',
    defaultChannel: '1081069976556945462',
  },
  buttons: {
    CREATE_TICKET: 'createTicket',
  },
  events: {
    CREATE_SUPPORT_CHANNEL: 'create.support.channel',
    APPLICATION_READY: 'application.ready',
    // Esta merda é ButtonInteraction<CacheType>
    BUTTON_INTERACTION: 'button.interaction',
    // Quando for esta merda é ChatInputCommandInteraction<CacheType>
    CHAT_INPUT_COMMAND: 'chat.command.interaction',
  },
};
