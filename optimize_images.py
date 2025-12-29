#!/usr/bin/env python3
"""
Image Optimization Script - Simple Version
- Compresses all images (JPG, PNG, WebP)
- Converts filenames from UPPERCASE to lowercase
- Updates all references in HTML files
"""

import os
import sys
from pathlib import Path

# Check for PIL/Pillow
try:
    from PIL import Image
    print("✓ Pillow library found")
except ImportError:
    print("\n❌ Error: Pillow library not found!")
    print("\nPlease install it with:")
    print("  pip3 install Pillow")
    print("\nOr install all requirements:")
    print("  pip3 install -r requirements.txt")
    sys.exit(1)

# Configuration
IMAGES_DIR = "images"
HTML_FILES = ["index.html"]
QUALITY_JPG = 85
QUALITY_PNG = 85
QUALITY_WEBP = 85

# Track renamed files for HTML update
file_mapping = {}

def format_size(size_bytes):
    """Format bytes to human readable"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def compress_image(image_path, quality=85):
    """Compress image while maintaining quality"""
    try:
        # Get original size
        original_size = os.path.getsize(image_path)

        # Open image
        img = Image.open(image_path)

        # Convert RGBA to RGB for JPG
        if image_path.suffix.lower() in ['.jpg', '.jpeg']:
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode in ('RGBA', 'LA'):
                    background.paste(img, mask=img.split()[-1])
                img = background

        # Save with compression
        if image_path.suffix.lower() == '.png':
            img.save(image_path, 'PNG', optimize=True, quality=quality)
        elif image_path.suffix.lower() in ['.jpg', '.jpeg']:
            img.save(image_path, 'JPEG', optimize=True, quality=quality)
        elif image_path.suffix.lower() == '.webp':
            img.save(image_path, 'WEBP', quality=quality)
        else:
            return None, None, 0

        # Get new size
        new_size = os.path.getsize(image_path)
        reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0

        return original_size, new_size, reduction

    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return None, None, 0

def rename_to_lowercase(file_path):
    """Rename file to lowercase"""
    old_name = file_path.name
    new_name = old_name.lower()

    if old_name != new_name:
        new_path = file_path.parent / new_name

        # Check if destination already exists
        if new_path.exists() and new_path != file_path:
            print(f"   ⚠️  Skipping: {new_name} already exists")
            return None, None

        try:
            file_path.rename(new_path)
            return old_name, new_name
        except Exception as e:
            print(f"   ⚠️  Error renaming: {e}")
            return None, None

    return None, None

def update_html_references(html_file, file_mapping):
    """Update all image references in HTML file"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        updates_count = 0

        # Update each renamed file
        for old_name, new_name in file_mapping.items():
            # Count occurrences
            count = content.count(old_name)
            if count > 0:
                content = content.replace(old_name, new_name)
                updates_count += count

        # Save if there were changes
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   ✓ Updated {updates_count} references in {html_file}")
            return updates_count
        else:
            print(f"   ℹ️  No references to update in {html_file}")
            return 0

    except Exception as e:
        print(f"   ⚠️  Error updating {html_file}: {e}")
        return 0

def get_image_files(directory):
    """Get all image files recursively"""
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'}
    image_files = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix in image_extensions:
                image_files.append(file_path)

    return image_files

def main():
    """Main function"""
    print("\n" + "="*60)
    print("Image Optimization Script")
    print("="*60 + "\n")

    # Check if images directory exists
    if not os.path.exists(IMAGES_DIR):
        print(f"❌ Error: Directory '{IMAGES_DIR}' not found!")
        sys.exit(1)

    # Confirm before proceeding
    print("⚠️  This script will:")
    print("   1. Compress all images (JPG, PNG, WebP)")
    print("   2. Convert all filenames to lowercase")
    print("   3. Update references in HTML files")
    print()

    response = input("Continue? (yes/no): ").strip().lower()

    if response not in ['yes', 'y']:
        print("Operation cancelled.")
        sys.exit(0)

    total_original = 0
    total_compressed = 0
    processed_count = 0
    renamed_count = 0

    # Get all image files
    print(f"\nScanning '{IMAGES_DIR}' directory...")
    image_files = get_image_files(IMAGES_DIR)
    print(f"Found {len(image_files)} images\n")

    # Step 1: Compress images
    print("Step 1: Compressing images...")
    print("-" * 60)

    for image_path in image_files:
        # Skip SVG files
        if image_path.suffix.lower() == '.svg':
            continue

        relative_path = image_path.relative_to(IMAGES_DIR)
        print(f"\n{relative_path}")

        original_size, new_size, reduction = compress_image(image_path, quality=QUALITY_JPG)

        if original_size and new_size:
            total_original += original_size
            total_compressed += new_size
            processed_count += 1

            print(f"   Before: {format_size(original_size)}")
            print(f"   After:  {format_size(new_size)}")
            print(f"   Saved:  {reduction:.1f}%")

    # Step 2: Rename files to lowercase
    print("\n\nStep 2: Converting filenames to lowercase...")
    print("-" * 60)

    # Get fresh list after compression
    image_files = get_image_files(IMAGES_DIR)

    for image_path in image_files:
        old_name, new_name = rename_to_lowercase(image_path)

        if old_name and new_name:
            relative_path = image_path.relative_to(IMAGES_DIR).parent
            if str(relative_path) == '.':
                print(f"\n{old_name} → {new_name}")
            else:
                print(f"\n{relative_path}/{old_name} → {new_name}")

            # Store mapping for HTML update
            file_mapping[old_name] = new_name
            renamed_count += 1

    # Step 3: Update HTML files
    if file_mapping:
        print("\n\nStep 3: Updating HTML files...")
        print("-" * 60)

        for html_file in HTML_FILES:
            if os.path.exists(html_file):
                print(f"\n{html_file}")
                update_html_references(html_file, file_mapping)
            else:
                print(f"\n⚠️  {html_file} not found")

    # Summary
    print("\n\n" + "="*60)
    print("Optimization Complete!")
    print("="*60)
    print(f"Images compressed: {processed_count}")
    print(f"Files renamed: {renamed_count}")

    if total_original > 0:
        print(f"\nOriginal size:    {format_size(total_original)}")
        print(f"Compressed size:  {format_size(total_compressed)}")
        total_reduction = ((total_original - total_compressed) / total_original) * 100
        print(f"Total reduction:  {total_reduction:.1f}%")
        print(f"Space saved:      {format_size(total_original - total_compressed)}")

    print("="*60 + "\n")

if __name__ == "__main__":
    main()
