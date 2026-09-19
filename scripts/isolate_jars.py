import os
from rembg import remove
from PIL import Image

images_to_process = [
    ("public/images/product_multifloral.jpg", "public/images/product_multifloral_nobg.png"),
    ("public/images/product_wildflower.jpg", "public/images/product_wildflower_nobg.png"),
    ("public/images/product_gulkand.jpg", "public/images/product_gulkand_nobg.png"),
    ("public/images/product_raw_reserve.jpg", "public/images/product_raw_reserve_nobg.png"),
    ("public/images/product_ghee.jpg", "public/images/product_ghee_nobg.png"),
    ("public/images/hero_honey_jar.jpg", "public/images/product_mountain_nobg.png"),
]

for src_path, dest_path in images_to_process:
    if os.path.exists(src_path):
        print(f"Processing {src_path} -> {dest_path}...")
        with Image.open(src_path) as img:
            # Remove background
            output = remove(img)
            # Crop bounding box of non-transparent pixels with slight padding
            bbox = output.getbbox()
            if bbox:
                # Add 10px padding if possible
                w, h = output.size
                pad = 10
                crop_box = (
                    max(0, bbox[0] - pad),
                    max(0, bbox[1] - pad),
                    min(w, bbox[2] + pad),
                    min(h, bbox[3] + pad)
                )
                output = output.crop(crop_box)
            output.save(dest_path, format="PNG")
            print(f"Successfully saved {dest_path} (size: {output.size})")
    else:
        print(f"Warning: {src_path} does not exist!")

print("All images processed successfully!")
