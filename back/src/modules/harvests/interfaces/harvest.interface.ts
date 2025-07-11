export interface HarvestInterface {
  property_id?: string;
  harvest_year: number;
  harvest_name: string;
  start_date: Date;
  end_date: Date;
  total_area_ha?: number;
}