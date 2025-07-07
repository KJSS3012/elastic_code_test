import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertyCropHarvestService } from './property-crop-harvest.service';
import { CreatePropertyCropHarvestDto } from './dto/create-property-crop-harvest.dto';
import { UpdatePropertyCropHarvestDto } from './dto/update-property-crop-harvest.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('property-crop-harvest')
export class PropertyCropHarvestController {
  constructor(private readonly propertyCropHarvestService: PropertyCropHarvestService) { }

  @Post()
  create(@Body() createPropertyCropHarvestDto: CreatePropertyCropHarvestDto) {
    return this.propertyCropHarvestService.create(createPropertyCropHarvestDto);
  }

  @Get()
  findAll() {
    return this.propertyCropHarvestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyCropHarvestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyCropHarvestDto: UpdatePropertyCropHarvestDto) {
    return this.propertyCropHarvestService.update(id, updatePropertyCropHarvestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyCropHarvestService.remove(id);
  }
}
