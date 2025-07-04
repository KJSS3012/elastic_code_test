import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FarmersModule } from './modules/farmers/farmers.module';

@Module({
  imports: [FarmersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
