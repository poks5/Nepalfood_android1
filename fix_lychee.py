import fitz
import json
from PIL import Image
import io

doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")
page = doc[45]
images = page.get_image_info(xrefs=True)

# Image 0 -> NFD-00067
xref_67 = images[0]["xref"]
img_67 = Image.open(io.BytesIO(doc.extract_image(xref_67)["image"]))
img_67.save("public/images/NFD-00067.jpg")

# Image 1 -> NFD-00068
xref_68 = images[1]["xref"]
img_68 = Image.open(io.BytesIO(doc.extract_image(xref_68)["image"]))
img_68.save("public/images/NFD-00068.jpg")

# Update DB
with open('src/data/database.json', 'r') as f:
    data = json.load(f)

for p in data['photos']:
    if p['food_id'] == 'NFD-00067':
        p['image_status'] = 'EXTRACTED'
        p['notes'] = ''
        p['image_path_or_reference'] = '/images/NFD-00067.jpg'
        p['image_filename'] = 'NFD-00067.jpg'
    elif p['food_id'] == 'NFD-00068':
        p['image_status'] = 'EXTRACTED'
        p['notes'] = ''
        p['image_path_or_reference'] = '/images/NFD-00068.jpg'
        p['image_filename'] = 'NFD-00068.jpg'

with open('src/data/database.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Lychee fixed")
