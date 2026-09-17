import json
import csv

with open('src/data/database.json', 'r') as f:
    db = json.load(f)

print("Original master length:", len(db['master']))

with open('food_master.csv', 'r') as f:
    raw_csv_rows = list(csv.reader(f))

headers = raw_csv_rows[0]

fixed_2024 = []

for idx in range(1, 101):
    r = raw_csv_rows[idx]
    food_id = r[0]
    
    if idx <= 46: # NFD-00001 to NFD-00046 (already correctly mapped)
        item = {
            "food_id": r[0],
            "food_name_original": r[1],
            "scientific_name": r[2],
            "food_group": r[3],
            "food_subgroup": r[4],
            "variety_name": r[5],
            "collection_area": r[6],
            "district": r[7],
            "province": r[8],
            "food_state": r[9] or "Raw",
            "edible_part": r[10] or "100 g edible part",
            "edible_part_percent": r[11],
            "inedible_part_percent": r[12],
            "lb_ratio": r[13],
            "kernel_weight_1000_g": r[14],
            "energy_kcal": r[15],
            "water_g": r[16],
            "protein_g": r[17],
            "fat_g": r[18],
            "ash_g": r[19],
            "crude_fiber_g": r[20],
            "carbohydrate_g": r[21],
            "reducing_sugar_g": r[22],
            "calcium_mg": r[23],
            "iron_mg": r[24],
            "phosphorus_mg": r[25],
            "potassium_mg": r[26],
            "sodium_mg": r[27],
            "zinc_mg": r[28],
            "total_carotenoids_ug": r[29],
            "vitamin_c_mg": r[30],
            "nutrient_basis": r[31] or "100 g edible part",
            "source_document": "Nepal Food Composition Database",
            "source_year": "2024",
            "source_page": r[34],
            "source_table": r[35],
            "source_figure": r[36],
            "extraction_confidence": r[37] or "HIGH",
            "needs_manual_review": r[38] or "FALSE",
            "notes": r[39]
        }
    else:
        # Rows 47 to 100: fix the column shift!
        item = {
            "food_id": r[0],
            "food_name_original": r[1],
            "scientific_name": r[2],
            "food_group": r[3],
            "food_subgroup": r[4],
            "variety_name": r[5],
            "collection_area": r[6],
            "district": r[7],
            "province": r[8],
            "food_state": "Raw",
            "edible_part": r[9] or "100 g edible part",
            "edible_part_percent": r[10],
            "inedible_part_percent": r[11],
            "lb_ratio": r[12],
            "kernel_weight_1000_g": r[13],
            "energy_kcal": r[14],
            "water_g": r[15],
            "protein_g": r[16],
            "fat_g": r[17],
            "ash_g": r[18],
            "crude_fiber_g": r[19],
            "carbohydrate_g": r[20],
            "reducing_sugar_g": r[21],
            "calcium_mg": r[22],
            "iron_mg": r[23],
            "phosphorus_mg": r[24],
            "potassium_mg": r[25],
            "sodium_mg": r[26],
            "zinc_mg": r[27],
            "total_carotenoids_ug": r[28],
            "vitamin_c_mg": r[29],
            "nutrient_basis": r[30] or "100 g edible part",
            "source_document": "Nepal Food Composition Database",
            "source_year": "2024",
            "source_page": r[31],
            "source_table": r[34],
            "source_figure": r[35],
            "extraction_confidence": r[39] if r[39] in ['HIGH', 'MEDIUM', 'LOW'] else "HIGH",
            "needs_manual_review": r[37] if r[37] in ['TRUE', 'FALSE'] else "FALSE",
            "notes": r[33] if r[33] not in ['2024', ''] else ""
        }
    fixed_2024.append(item)

print(f"Fixed 2024 records: {len(fixed_2024)}")

# Keep the 544 records from 2012
records_2012 = [x for x in db['master'] if x.get('source_year') == '2012']
print(f"Found 2012 records: {len(records_2012)}")

# Ensure all 2012 records have consistent metadata
for item in records_2012:
    item['source_year'] = '2012'
    item['source_document'] = 'Nepal Food Composition Table'
    if not item.get('nutrient_basis'):
        item['nutrient_basis'] = '100g'

# Combine: 100 from 2024 + 544 from 2012 = 644
db['master'] = fixed_2024 + records_2012
print(f"Total new master records: {len(db['master'])}")

# Write to src/data/database.json
with open('src/data/database.json', 'w') as f:
    json.dump(db, f, indent=2)

# Also update food_master.csv and public/food_master.csv so exports and raw files match
all_keys = list(fixed_2024[0].keys())

with open('food_master.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=all_keys)
    writer.writeheader()
    writer.writerows(fixed_2024)

with open('public/food_master.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=all_keys)
    writer.writeheader()
    writer.writerows(fixed_2024)

# Also create dedicated 2012 and combined CSVs in public/
with open('public/food_master_2012.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=all_keys)
    writer.writeheader()
    writer.writerows(records_2012)

with open('public/food_master_combined.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=all_keys)
    writer.writeheader()
    writer.writerows(db['master'])

print("All CSVs and JSON successfully generated!")
