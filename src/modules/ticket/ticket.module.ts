import { DiscordModule } from '@modules/discord/discord.module';
import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigureSupportChannelUseCase } from './usecases/configure-support-channel.usecase';
import { CreateSupportChannelUseCase } from './usecases/create-support-channel.usecase';

@Module({
  imports: [DiscordModule, SharedModule, EventEmitterModule.forRoot()],
  providers: [ConfigureSupportChannelUseCase, CreateSupportChannelUseCase],
})
export class TicketModule {}
