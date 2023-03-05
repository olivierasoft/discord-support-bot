import { TicketModule } from '@modules/ticket/ticket.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TicketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
