import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) { }

  async getAdminStats(filters?: DashboardQueryDto) {
    try {
      const [
        totalFarmers,
        totalProperties,
        totalHectares,
        propertiesByState,
        topCities,
        cropDistribution,
        landUseDistribution
      ] = await Promise.all([
        this.dashboardRepository.getTotalFarmers(filters),
        this.dashboardRepository.getTotalProperties(filters),
        this.dashboardRepository.getTotalHectares(filters),
        this.dashboardRepository.getFarmersByState(filters),
        this.dashboardRepository.getFarmersByCities(filters),
        this.dashboardRepository.getCropDistribution(filters),
        this.dashboardRepository.getLandUseDistribution(filters)
      ]);

      // Calcular total de culturas baseado na distribuição
      const totalCrops = cropDistribution.reduce((sum, crop) => sum + parseFloat(crop.area), 0);

      return {
        data: {
          totalFarmers,
          totalProperties,
          totalHectares: Math.round(totalHectares),
          totalCrops: Math.round(totalCrops),
          propertiesByState: propertiesByState.map(item => ({
            state: item.state,
            count: parseInt(item.count)
          })),
          topCities: topCities.map(item => ({
            city: item.city,
            count: parseInt(item.count)
          })),
          cropDistribution: cropDistribution.map(item => ({
            name: item.name,
            area: Math.round(parseFloat(item.area))
          })),
          landUseDistribution: landUseDistribution.map(item => ({
            name: item.name,
            value: Math.round(item.value)
          }))
        }
      };
    } catch (error) {
      throw new Error('Error fetching admin dashboard stats: ' + error.message);
    }
  }

  async getFarmerStats(farmerId: string, filters?: DashboardQueryDto) {
    try {
      const [
        totalProperties,
        totalHectares,
        activeHarvests,
        totalCrops,
        myProperties,
        myCrops,
        myLandUse
      ] = await Promise.all([
        this.dashboardRepository.getFarmerProperties(farmerId, filters).then(props => props.length),
        this.dashboardRepository.getFarmerTotalHectares(farmerId, filters),
        this.dashboardRepository.getFarmerActiveHarvests(farmerId, filters),
        this.dashboardRepository.getFarmerTotalCrops(farmerId, filters),
        this.dashboardRepository.getFarmerProperties(farmerId, filters),
        this.dashboardRepository.getFarmerCrops(farmerId, filters),
        this.dashboardRepository.getFarmerLandUse(farmerId, filters)
      ]);

      return {
        data: {
          totalProperties,
          totalHectares: Math.round(totalHectares),
          activeHarvests,
          totalCrops,
          myProperties: myProperties.map(prop => ({
            name: prop.name,
            totalArea: Math.round(parseFloat(prop.totalarea))
          })),
          myCrops: myCrops.map(crop => ({
            name: crop.name,
            area: Math.round(parseFloat(crop.area))
          })),
          myLandUse: myLandUse.map(item => ({
            name: item.name,
            value: Math.round(item.value)
          }))
        }
      };
    } catch (error) {
      throw new Error('Error fetching farmer dashboard stats: ' + error.message);
    }
  }
}
