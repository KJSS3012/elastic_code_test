import { Module } from "@nestjs/common";
import { HavestRepository } from "./harvests.repository";
import { HarvestsController } from "./harvests.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Harvest } from "./entities/harvest.entity";
import { HarvestsService } from "./harvests.service";

@Module({
  imports: [TypeOrmModule.forFeature([Harvest])],
  controllers: [HarvestsController],
  providers: [HavestRepository, HarvestsService],
  exports: [HarvestsService, HavestRepository],
})

export class HarvestsModule { }