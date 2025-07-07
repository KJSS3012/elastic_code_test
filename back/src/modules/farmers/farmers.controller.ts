import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { UpdateFarmerPasswordDto } from './dto/update-farmer-password.dto';
import { FarmerListDto } from './dto/farmer-list.dto';
import { FarmerDetailDto } from './dto/farmer-detail.dto';

@ApiTags('farmers')
@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) { }

  @ApiOperation({ summary: 'List all farmers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of farmers returned successfully',
    type: FarmerListDto,
    isArray: true,
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.farmersService.findAll(Number(page), Number(limit));
  }

  @ApiOperation({ summary: 'Get a farmer by id' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the farmer' })
  @ApiResponse({
    status: 200,
    description: 'Farmer found successfully',
    type: FarmerDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID or farmer not found' })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.farmersService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new farmer' })
  @ApiBody({ type: CreateFarmerDto })
  @ApiResponse({ status: 201, description: 'Farmer created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  async create(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmersService.create(createFarmerDto);
  }

  @ApiOperation({ summary: 'Update a farmer by id' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the farmer' })
  @ApiBody({ type: UpdateFarmerDto })
  @ApiResponse({ status: 200, description: 'Farmer updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or farmer not found' })
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
  ) {
    return this.farmersService.update(id, updateFarmerDto);
  }

  @ApiOperation({ summary: "Update a farmer's password by id" })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the farmer' })
  @ApiBody({ type: UpdateFarmerPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Farmer password updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID or farmer not found' })
  @Patch(':id/password')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFarmerPasswordDto: UpdateFarmerPasswordDto,
  ) {
    return this.farmersService.updatePassword(id, updateFarmerPasswordDto);
  }

  @ApiOperation({ summary: 'Remove a farmer by id' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the farmer' })
  @ApiResponse({ status: 200, description: 'Farmer removed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or farmer not found' })
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.farmersService.remove(id);
  }
}
