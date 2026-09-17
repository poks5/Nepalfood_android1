with open('src/components/PhotoPlaceholder.tsx', 'r') as f:
    content = f.read()

old_if = "if (photoInfo?.image_file && photoInfo.image_file.trim() !== '') {"

new_if = """// Support the new EXTRACTED state
  const isExtracted = photoInfo?.image_status === 'EXTRACTED' && photoInfo?.image_path_or_reference;
  if (isExtracted || (photoInfo?.image_file && photoInfo.image_file.trim() !== '')) {
    const imgSrc = isExtracted ? photoInfo.image_path_or_reference : photoInfo.image_file;
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-100 ${className}`}>
        <img
          src={imgSrc}
          alt={foodName}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {photoInfo?.figure_number && (
          <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
            {photoInfo.figure_number}
          </span>
        )}
      </div>
    );
  }
  
  // Visual sizes"""

import re
content = re.sub(r'if \(photoInfo\?\.image_file && photoInfo\.image_file\.trim\(\) !== \'\'\) \{.*?\n  \}[\n ]+// Visual sizes', new_if, content, flags=re.DOTALL)

with open('src/components/PhotoPlaceholder.tsx', 'w') as f:
    f.write(content)

print("Updated PhotoPlaceholder")
