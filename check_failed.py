import json
with open('src/data/database.json', 'r') as f:
    data = json.load(f)
for p in data['photos']:
    if p.get('image_status') != 'EXTRACTED':
        print(f"Failed: {p['food_id']} - {p.get('figure_number')} - Notes: {p.get('notes')}")
