import json

# Let's read the database and update it to show the extraction failed because 
# the file wasn't uploaded as a document file, but rather as a chat attachment.

with open('src/data/database.json', 'r') as f:
    data = json.load(f)

for p in data['photos']:
    p['image_status'] = "NOT_EXTRACTED"
    p['notes'] = "PDF uploaded as chat attachment instead of workspace file. Direct extraction impossible."

with open('src/data/database.json', 'w') as f:
    json.dump(data, f, indent=2)
