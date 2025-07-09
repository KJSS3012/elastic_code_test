import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtPayloadInterface } from '../auth/interface/jwt.payload.interface';

@UseGuards(AuthGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.create(createPropertyDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayloadInterface, @Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.propertiesService.findAll(user, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.update(id, updatePropertyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.remove(id, user);
  }

  @Post(':id/harvest-crop')
  addHarvestCrop(@Param('id') propertyId: string, @Body() data: any, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.addHarvestCrop(propertyId, data, user);
  }

  @Delete(':propertyId/harvest/:harvestId')
  removeHarvest(@Param('propertyId') propertyId: string, @Param('harvestId') harvestId: string, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.removeHarvest(propertyId, harvestId, user);
  }

  @Delete(':propertyId/harvest/:harvestId/crop/:cropId')
  removeCrop(@Param('propertyId') propertyId: string, @Param('harvestId') harvestId: string, @Param('cropId') cropId: string, @CurrentUser() user: JwtPayloadInterface) {
    return this.propertiesService.removeCrop(propertyId, harvestId, cropId, user);
  }
}
