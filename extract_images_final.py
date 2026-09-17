import fitz
from PIL import Image
import io
import json
import os
import re

os.makedirs("public/images", exist_ok=True)

with open('src/data/database.json', 'r') as f:
    data = json.load(f)

doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")

EXACT_MAPPING = {
    # Page 17
    'Figure 2.1': (17, [0, 1]),
    'Figure 2.2': (17, [2, 3]),
    'Figure 2.3': (17, [4, 5]),
    # Page 18
    'Figure 2.4': (18, [0, 1]),
    'Figure 2.5': (18, [2, 3]),
    'Figure 2.6': (18, [4, 5]),
    # Page 19
    'Figure 2.7': (19, [0, 1]),
    'Figure 2.8': (19, [2, 3]),
    'Figure 2.9': (19, [4, 5]),
    # Page 20
    'Figure 2.10': (20, [0]),
    'Figure 2.11': (20, [1]),
    'Figure 2.12': (20, [2]),
    'Figure 2.13': (20, [3]),
    # Page 21
    'Figure 2.14': (21, [0]),
    # Page 22
    'Figure 2.15': (22, [0, 1]),
    'Figure 2.16': (22, [2, 3]),
    'Figure 2.17': (22, [4, 5]),
    # Page 23
    'Figure 2.18': (23, [0, 1]),
    'Figure 2.19': (23, [2, 3]),
    'Figure 2.20': (23, [4, 5]),
    # Page 25
    'Figure 2.21': (25, [0]),
    'Figure 2.22': (25, [1]),
    'Figure 2.23': (25, [2]),
    'Figure 2.24': (25, [3]),
    'Figure 2.25': (25, [4]),
    'Figure 2.26': (25, [5]),
    # Page 26
    'Figure 2.27': (26, [0]),
    'Figure 2.28': (26, [1]),
    # Page 27
    'Figure 2.29': (27, [0, 1]),
    'Figure 2.30': (27, [2, 3]),
    # Page 28
    'Figure 2.31': (28, [0]),
    'Figure 2.32': (28, [1, 2]),
    'Figure 2.33': (28, [3, 4]),
    'Figure 2.34': (28, [5, 6]),
    # Page 34
    'Figure 3.1': (34, [0]),
    'Figure 3.2': (34, [1]),
    'Figure 3.3': (34, [2]),
    'Figure 3.4': (34, [3]),
    'Figure 3.5': (34, [4]),
    'Figure 3.6': (34, [5]),
    # Page 35
    'Figure 3.7': (35, [0]),
    'Figure 3.8': (35, [1]),
    'Figure 3.9': (35, [2]),
    'Figure 3.10': (35, [3]),
    'Figure 3.11': (35, [4]),
    'Figure 3.12': (35, [5]),
    # Page 38
    'Figure 4.1': (38, [0]),
    'Figure 4.2': (38, [1]),
    'Figure 4.3': (38, [2]),
    'Figure 4.4': (38, [3]),
    'Figure 4.5': (38, [4]),
    'Figure 4.6': (38, [5]),
    # Page 39
    'Figure 4.7': (39, [0]),
    'Figure 4.8': (39, [1, 2]),
    'Figure 4.9': (39, [3]),
    # Page 40
    'Figure 4.10': (40, [0, 1]),
    'Figure 4.11': (40, [2, 3]),
    # Page 43
    'Figure 5.1': (43, [0, 1]),
    'Figure 5.2': (43, [2, 3]),
    'Figure 5.3': (43, [4, 5]),
    # Page 44
    'Figure 5.4': (44, [0, 1]),
    'Figure 5.5': (44, [2, 3]),
    'Figure 5.6': (44, [4, 5]),
    # Page 45
    '5.7': (45, [0, 1]),
    'Figure 5.8': (45, [2, 4]),
    'Figure 5.9': (45, [3, 5]),
    # Page 46
    'Figure 5.10': (46, [0]),
    'Figure 5.11': (46, [1]),
    'Figure 5.12': (46, [2, 3]),
    'Figure 5.13': (46, [4, 5]),
    'Figure 5.14': (46, []),  # Not printed in the 2024 published PDF
    # Page 47
    'Figure 5.15': (47, [0, 1]),
    'Figure 5.16': (47, [2, 3]),
    'Figure 5.17': (47, [4, 5]),
    # Page 50
    'Figure 5.18': (50, [0]),
    'Figure 5.19': (50, [1]),
    'Figure 5.20': (50, [2, 3]),
    'Figure 5.21': (50, [4, 5]),
    # Page 51
    'Figure 5.22': (51, [0, 1]),
    'Figure 5.23': (51, [2, 3]),
    'Figure 5.24': (51, [4]),
    # Page 52
    'Figure 5.25': (52, [0, 1]),
    'Figure 5.26': (52, [2, 3]),
    'Figure 5.27': (52, [4, 5]),
    # Page 53
    'Figure 5.28': (53, [0, 1]),
    'Figure 5.29': (53, [2, 3]),
    'Figure 5.30': (53, [4, 5]),
    # Page 54
    'Figure 5.31': (54, [0, 1]),
    'Figure 5.32': (54, [2, 3]),
    'Figure 5.33': (54, [4, 5]),
    # Page 55
    'Figure 5.34': (55, [0]),
    'Figure 5.35': (55, [1, 2]),
    'Figure 5.36': (55, [3]),
    'Figure 5.37': (55, [4]),
    # Page 56
    'Figure 5.38': (56, [0]),
    'Figure 5.39': (56, [1]),
    'Figure 5.40': (56, [2]),
    'Figure 5.41': (56, [3]),
    'Figure 5.42': (56, [4, 5]),
    # Page 57
    'Figure 5.43': (57, [0, 1]),
}

def stitch_images(pil_images):
    if len(pil_images) == 1:
        return pil_images[0]
    target_height = max(im.height for im in pil_images)
    resized_images = []
    for im in pil_images:
        if im.height != target_height:
            new_w = int(im.width * (target_height / im.height))
            resized_images.append(im.resize((new_w, target_height), Image.LANCZOS))
        else:
            resized_images.append(im)
    total_w = sum(im.width for im in resized_images) + 8 * (len(resized_images) - 1)
    canvas = Image.new('RGB', (total_w, target_height), (255, 255, 255))
    cur_x = 0
    for im in resized_images:
        canvas.paste(im, (cur_x, 0))
        cur_x += im.width + 8
    return canvas

for p in data['photos']:
    fid = p['food_id']
    f_num = p['figure_number']
    if f_num not in EXACT_MAPPING:
        continue
    page_num, img_indices = EXACT_MAPPING[f_num]
    
    if not img_indices:
        p['image_status'] = 'NOT_FOUND_IN_PDF'
        p['notes'] = 'Photograph not present in the published 2024 PDF'
        p['image_filename'] = ''
        p['image_path_or_reference'] = ''
        old_file = os.path.join("public/images", f"{fid}.jpg")
        if os.path.exists(old_file):
            os.remove(old_file)
        continue
        
    page = doc[page_num - 1]
    images_info = page.get_image_info(xrefs=True)
    
    pil_images = []
    for idx in img_indices:
        xref = images_info[idx]["xref"]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        pil_images.append(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
        
    final_img = stitch_images(pil_images)
    filename = f"{fid}.jpg"
    final_img.save(os.path.join("public/images", filename), "JPEG", quality=95)
    
    p["image_status"] = "EXTRACTED"
    p["image_path_or_reference"] = f"/images/{filename}"
    p["image_filename"] = filename
    p["notes"] = f"Verified from PDF Page {page_num}, Figure {f_num}"

with open('src/data/database.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Extraction completed.")
