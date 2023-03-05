import { DiscordConstant } from '@config/constants/discord.constant';
import { Providers } from '@config/constants/providers.constant';
import { ChannelSummary } from '@core/models/channel-summary.model';
import { Dependencies, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  Client,
  EmbedBuilder,
  Guild,
  TextChannel,
} from 'discord.js';

@Injectable()
export class ConfigureSupportChannelUseCase {
  private openTicketChannelName = 'support';
  private logger = new Logger(ConfigureSupportChannelUseCase.name);
  private defaultGuild: Guild;

  constructor(
    @Inject(Providers.DISCORD) private client: Client,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(DiscordConstant.events.BUTTON_INTERACTION)
  async onCreateTicketButton(interaction: ButtonInteraction<CacheType>) {
    if (interaction.customId === DiscordConstant.buttons.CREATE_TICKET) {
      const reply = await interaction.reply({
        fetchReply: true,
        content: `Olá ${interaction.member.user.username}, um novo canal de texto foi criado, confira na sessão de suporte em texto`,
      });

      this.eventEmitter.emit(
        DiscordConstant.events.CREATE_SUPPORT_CHANNEL,
        interaction.member,
        this.defaultGuild,
      );

      setTimeout(() => {
        reply.delete();
      }, 10000);
    }
  }

  @OnEvent(DiscordConstant.events.APPLICATION_READY)
  async configureApplicationConfigurationChannel(): Promise<void> {
    const guild = DiscordConstant.guilds.defaultGuild;

    this.defaultGuild = this.client.guilds.resolve(guild);

    const haveTicketChannel = await this.haveTicketChannel(this.defaultGuild);

    if (haveTicketChannel) return;

    this.logger.log('Configuring support channel');

    const supportChannel = await this.defaultGuild.channels.create({
      type: ChannelType.GuildText,
      name: this.openTicketChannelName,
      parent: DiscordConstant.channels.supportChannelCategory,
    });

    this.sendSupportMessage(supportChannel);
  }

  async sendSupportMessage(channel: TextChannel) {
    const embed = new EmbedBuilder()
      .setTitle('Discord Support')
      .setDescription('Para criar um ticket clique no botão abaixo');

    const createTicketButton = new ButtonBuilder()
      .setLabel('Criar Ticket')
      .setCustomId(DiscordConstant.buttons.CREATE_TICKET)
      .setStyle(ButtonStyle.Primary);

    const actionBuilder = new ActionRowBuilder<ButtonBuilder>().addComponents(
      createTicketButton,
    );

    await channel.send({
      embeds: [embed],
      components: [actionBuilder],
    });
  }

  async haveTicketChannel(guild: Guild): Promise<ChannelSummary | undefined> {
    const channels = await guild.channels.fetch().then((channel) =>
      channel
        .map(
          (ch) =>
            ({
              name: ch.name,
              key: ch.id,
              type: ch.type,
            } satisfies ChannelSummary),
        )
        .filter((ch) => ch.type === ChannelType.GuildText),
    );

    return channels.find((ch) => ch.name === this.openTicketChannelName);
  }
}
