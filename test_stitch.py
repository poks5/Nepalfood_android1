import fitz
from PIL import Image
import io

doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")
page = doc[16] # Page 17
images = page.get_image_info(xrefs=True)

# For Figure 2.1 (which is at Y=258), the images are indices 0 and 1.
xrefs = [images[0]["xref"], images[1]["xref"]]
pil_images = []
for xref in xrefs:
    base_image = doc.extract_image(xref)
    image_bytes = base_image["image"]
    img = Image.open(io.BytesIO(image_bytes))
    pil_images.append(img)

# Stitch side-by-side
widths, heights = zip(*(i.size for i in pil_images))
total_width = sum(widths) + 10 # 10px gap
max_height = max(heights)

new_im = Image.new('RGB', (total_width, max_height), color='white')
x_offset = 0
for im in pil_images:
    new_im.paste(im, (x_offset, 0))
    x_offset += im.size[0] + 10

new_im.save("public/test_stitched.jpg")
print("Saved public/test_stitched.jpg")
