import json

with open('src/data/database.json', 'r') as f:
    data = json.load(f)

# The user asked to add image info to the 2024 food records.
# We will update the 'photos' records to match the requested schema.

for p in data['photos']:
    food_id = p['food_id']
    p['image_id'] = f"IMG-{food_id}"
    p['image_filename'] = f"{food_id}.jpg"
    p['image_path_or_reference'] = f"/images/{food_id}.jpg"
    p['source_page'] = p.get('pdf_page', '')
    p['image_status'] = "NOT_EXTRACTED"

with open('src/data/database.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Database updated")
