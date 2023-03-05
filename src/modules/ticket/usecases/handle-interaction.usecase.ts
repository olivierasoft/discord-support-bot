import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { ConfigureSupportChannelUseCase } from './configure-support-channel.usecase';

@Injectable()
export class HandleInteractionUseCase {
  constructor(private client: Client) {}
}
