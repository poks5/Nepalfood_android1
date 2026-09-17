import fitz
doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")
page = doc[16] # Page 17
images = page.get_images(full=True)
print(f"Page 17 has {len(images)} images.")
for i, img in enumerate(images):
    xref = img[0]
    base_image = doc.extract_image(xref)
    print(f"Image {i}: {base_image['ext']}, {base_image['width']}x{base_image['height']}")
