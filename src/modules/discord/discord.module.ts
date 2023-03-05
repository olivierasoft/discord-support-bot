import { Providers } from '@config/constants/providers.constant';
import { SharedModule } from '@modules/shared/shared.module';
import { Module, Provider } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { OnInteractionCreateUseCase } from './events/on-interaction-create.usecase';

const discordProvider: Provider<Client> = {
  provide: Providers.DISCORD,
  useFactory: async () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    await client.login(process.env.DISCORD_TOKEN);

    return client;
  },
};

@Module({
  imports: [SharedModule],
  providers: [discordProvider, OnInteractionCreateUseCase],
  exports: [discordProvider],
})
export class DiscordModule {}
