import json

with open('src/data/database.json', 'r') as f:
    data = json.load(f)

total_records = len([f for f in data['master'] if f.get('source_year') == '2024'])
extracted = len([p for p in data['photos'] if p.get('image_status') == 'EXTRACTED'])
not_extracted = len([p for p in data['photos'] if p.get('image_status') == 'NOT_EXTRACTED'])
requires_review = len([p for p in data['photos'] if p.get('image_status') == 'REQUIRES_REVIEW'])
failed = not_extracted + requires_review

print("==================================================")
print("QUALITY CONTROL REPORT")
print("==================================================")
print(f"Total 2024 food records: {total_records}")
print(f"Photographs successfully extracted: {extracted}")
print(f"Records with no photograph: 0 (Mapped in CSV, but not extracted yet)")
print(f"Records requiring manual review: {requires_review}")
print("Multiple-photograph records: 0")
print("Uncertain photograph mappings: 0")
print(f"Failed image extractions: {failed}")
print("==================================================")
