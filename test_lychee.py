import fitz
doc = fitz.open("public/NepalFoodcompositiondatabase.pdf")
page = doc[45] # 0-indexed for 46
print("Images:")
for img in page.get_image_info(xrefs=True):
    print(img["bbox"])
print("Blocks:")
for b in page.get_text("dict")["blocks"]:
    if "lines" in b:
        print(b["bbox"], "".join(s["text"] for l in b["lines"] for s in l["spans"]))
