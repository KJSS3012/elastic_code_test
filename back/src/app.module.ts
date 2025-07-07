import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FarmersModule } from './modules/farmers/farmers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { HarvestsModule } from './modules/harvests/harvests.module';
import { CropsModule } from './modules/crops/crops.module';
import { PropertiesModule } from './modules/properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmConfig,
    FarmersModule,
    HarvestsModule,
    AuthModule,
    CropsModule,
    PropertiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
