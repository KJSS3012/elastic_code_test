import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HarvestsService } from "./harvests.service";
import { CreateHarvestDto } from "./dto/create-harvest.dto";
import { UpdateHarvestDto } from "./dto/update-harvest.dto";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@ApiTags('harvests')
@Controller("harvests")
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) { }

  @Get()
  async findAll() {
    return this.harvestsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.harvestsService.findOne(id);
  }

  @Post()
  async create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestsService.create(createHarvestDto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestsService.update(id, updateHarvestDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.harvestsService.remove(id);
  }
}