import fitz
doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")
page = doc[16] # Page 17
images = page.get_image_info(xrefs=True)
for i, img in enumerate(images):
    print(f"Image {i}: bbox {img['bbox']}")

blocks = page.get_text("dict")["blocks"]
for b in blocks:
    if "lines" in b:
        text = "".join(span["text"] for line in b["lines"] for span in line["spans"])
        if text.startswith("Figure"):
            print(f"Caption: {text}, bbox {b['bbox']}")
