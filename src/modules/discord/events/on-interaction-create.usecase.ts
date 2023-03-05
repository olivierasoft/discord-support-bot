import { DiscordConstant } from '@config/constants/discord.constant';
import { Providers } from '@config/constants/providers.constant';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Client, Events } from 'discord.js';

@Injectable()
export class OnInteractionCreateUseCase {
  constructor(
    @Inject(Providers.DISCORD) private client: Client,
    private eventEmitter: EventEmitter2,
  ) {
    this.client.on('ready', () => {
      this.eventEmitter.emit(DiscordConstant.events.APPLICATION_READY);
    });
  }

  @OnEvent(DiscordConstant.events.APPLICATION_READY)
  onApplicationReady(): void {
    this.client.on(Events.InteractionCreate, (interaction) => {
      if (interaction.isButton()) {
        this.eventEmitter.emit(
          DiscordConstant.events.BUTTON_INTERACTION,
          interaction,
        );
      }
      if (interaction.isChatInputCommand()) {
        this.eventEmitter.emit(
          DiscordConstant.events.CHAT_INPUT_COMMAND,
          interaction,
        );
      }
    });
  }
}
