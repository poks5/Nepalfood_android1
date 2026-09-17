export type Language = 'en' | 'ne';

export type NavTab = 'home' | 'foods' | 'table' | 'search' | 'favorites' | 'more';

export interface FoodMasterItem {
  food_id: string;
  food_name_original: string;
  scientific_name: string;
  food_group: string;
  food_subgroup: string;
  variety_name: string;
  collection_area: string;
  district: string;
  province: string;
  food_state: string;
  edible_part: string;
  edible_part_percent: string;
  inedible_part_percent: string;
  lb_ratio: string;
  kernel_weight_1000_g: string;
  energy_kcal: string;
  water_g: string;
  protein_g: string;
  fat_g: string;
  ash_g: string;
  crude_fiber_g: string;
  carbohydrate_g: string;
  reducing_sugar_g: string;
  calcium_mg: string;
  iron_mg: string;
  phosphorus_mg: string;
  potassium_mg: string;
  sodium_mg: string;
  zinc_mg: string;
  total_carotenoids_ug: string;
  vitamin_c_mg: string;
  nutrient_basis: string;
  source_document: string;
  source_year: string;
  source_page: string;
  source_table: string;
  source_figure: string;
  extraction_confidence: string;
  needs_manual_review: string;
  notes: string;
}

export interface FoodPhotoItem {
  food_id: string;
  image_id?: string;
  image_filename?: string;
  image_path_or_reference?: string;
  figure_number: string;
  figure_caption: string;
  pdf_page?: string;
  source_page?: string;
  image_file?: string;
  image_description: string;
  photograph_mapping_confidence: string;
  source_document: string;
  source_year: string;
  image_status?: string;
  notes: string;
}
