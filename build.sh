#!/bin/bash
set -e

# Build main 10k tracker app
echo "Building 10k tracker..."
cd app
npm install
npm run build
cd ..

# Build wardrobe stylist app
echo "Building wardrobe stylist..."
cd wardrobe
npm install
npm run build
cd ..

# Merge wardrobe dist into main dist under /wardrobe/
echo "Merging builds..."
mkdir -p app/dist/wardrobe
cp -r wardrobe/dist/. app/dist/wardrobe/

echo "Done. All assets in app/dist/"
