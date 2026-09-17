with open('src/types.ts', 'r') as f:
    content = f.read()

new_photo_item = """export interface FoodPhotoItem {
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
}"""

import re
content = re.sub(r'export interface FoodPhotoItem \{.*?\n\}', new_photo_item, content, flags=re.DOTALL)

with open('src/types.ts', 'w') as f:
    f.write(content)

print("Updated types.ts")
