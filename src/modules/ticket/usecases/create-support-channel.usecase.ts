import { DiscordConstant } from '@config/constants/discord.constant';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ChannelType,
  Guild,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';

@Injectable()
export class CreateSupportChannelUseCase {
  @OnEvent(DiscordConstant.events.CREATE_SUPPORT_CHANNEL)
  async createSupportChannel({ user }: GuildMember, guild: Guild) {
    const userChannelName =
      `support-${user.username}-${user.discriminator}`.toLowerCase();

    const userAlreadyCreatedChannel = await guild.channels
      .fetch()
      .then((channels) =>
        channels
          .filter((channel) => channel.type === ChannelType.GuildText)
          .filter((channel) => channel.name === userChannelName),
      );

    if (userAlreadyCreatedChannel.size) {
      return;
    }

    const newChannel = await guild.channels.create({
      name: `support-${user.username}-${user.discriminator}`,
      parent: DiscordConstant.channels.supportChannelCategory,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    // Remover depois
    setTimeout(() => newChannel.delete(), 5000);

    newChannel.send(
      `Olá <@!${user.id}>, este é o canal de suporte, explique seu problema e logo iremos responder`,
    );
  }
}
